import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let user = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!user) {
            const clerkUser = await currentUser();
            const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `seeker_${clerkId}@clerk.local`;
            const firstName = clerkUser?.firstName;
            const lastName = clerkUser?.lastName;

            user = await prisma.user.create({
                data: {
                    clerkId,
                    email,
                    role: "SEEKER",
                    firstName,
                    lastName
                }
            });
        }

        // 1. Upload the raw PDF to Supabase Storage
        const fileExt = file.name.split('.').pop() || 'pdf';
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('resumes')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json({ error: "Failed to upload resume to storage engine" }, { status: 500 });
        }

        const { data: { publicUrl: resumeUrl } } = supabaseAdmin
            .storage
            .from('resumes')
            .getPublicUrl(filePath);

        // 2. Parse the PDF text for Gemini
        const pdf = require("pdf-parse");
        let extractedText = "";

        if (file.type === "application/pdf") {
            try {
                const data = await pdf(buffer);
                extractedText = data.text;
            } catch (err) {
                console.error("PDF Parse error:", err);
                return NextResponse.json({ error: "Failed to parse PDF content" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Unsupported file type for MVP" }, { status: 400 });
        }

        // 3. Extract core skills & experience using Google Gemini
        let skills = "Unable to extract";
        let experience = 0;
        let summary = "Profile successfully extracted and saved.";

        if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            try {
                const { object } = await generateObject({
                    model: google("gemini-1.5-flash"),
                    schema: z.object({
                        skills: z.array(z.string()).describe("A list of 5-15 technical and professional skills mentioned in the resume"),
                        experience: z.number().describe("Total years of professional experience as an integer"),
                        summary: z.string().describe("A brief 1-2 sentence professional summary of the candidate"),
                    }),
                    prompt: `
                    You are an expert HR extraction API. Analyze the following resume text and extract:
                    1. A list of technical and professional skills.
                    2. Total years of professional experience (integer).
                    3. A brief professional summary.

                    Resume Text:
                    ${extractedText.substring(0, 15000)}
                    `,
                });

                if (object.skills && object.skills.length > 0) {
                    const normalized = Array.from(new Set(
                        object.skills.map(s => s.trim()).filter(Boolean)
                    ));
                    skills = normalized.join(', ');
                }
                
                experience = object.experience || 0;
                summary = object.summary || summary;

            } catch (err) {
                console.error("Gemini Native Extraction failed:", err);
                return NextResponse.json({ 
                    error: "AI extraction failed. Please try a different PDF or ensure it is not password protected." 
                }, { status: 500 });
            }
        } else {
            console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing");
            return NextResponse.json({ error: "AI Service not configured" }, { status: 500 });
        }

        // 4. Upsert the Profile record into Prisma
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                skills,
                experience,
                resumeUrl
            },
            create: {
                userId: user.id,
                skills,
                experience,
                resumeUrl
            }
        });

        return NextResponse.json({
            success: true,
            skills,
            experience,
            resumeUrl,
            message: summary
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to process resume pipeline" }, { status: 500 });
    }
}

