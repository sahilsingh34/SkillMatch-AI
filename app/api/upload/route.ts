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
        console.log("[Resume Pipeline] Starting request...");
        
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            console.error("[Resume Pipeline] Unauthorized: No clerkId found");
            return NextResponse.json({ error: "Unauthorized: Please log in again." }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("[Resume Pipeline] Bad Request: No file provided");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`[Resume Pipeline] Processing file: ${file.name} (${file.size} bytes)`);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("[Resume Pipeline] Checking user in database...");
        let user = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!user) {
            console.log("[Resume Pipeline] User not found, creating new user record...");
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
        console.log("[Resume Pipeline] Uploading to Supabase Storage...");
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
            console.error("[Resume Pipeline] Supabase Storage Error:", uploadError);
            return NextResponse.json({ error: `Storage Error: ${uploadError.message}` }, { status: 500 });
        }

        const { data: { publicUrl: resumeUrl } } = supabaseAdmin
            .storage
            .from('resumes')
            .getPublicUrl(filePath);

        console.log(`[Resume Pipeline] File uploaded successfully. Public URL: ${resumeUrl}`);

        // 2. Extract core skills & experience using Google Gemini (Native Multimodal)
        console.log("[Resume Pipeline] Starting Gemini Native Extraction...");
        let skills = "Unable to extract";
        let experience = 0;
        let summary = "Your profile has been successfully processed.";

        if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            try {
                const { object } = await generateObject({
                    model: google("gemini-1.5-flash"),
                    schema: z.object({
                        skills: z.array(z.string()).describe("A list of 5-15 technical and professional skills mentioned in the resume"),
                        experience: z.number().describe("Total years of professional experience as an integer"),
                        summary: z.string().describe("A brief 1-2 sentence professional summary of the candidate"),
                    }),
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "You are an expert HR extraction API. Analyze the attached resume PDF and extract: 1. A list of technical and professional skills. 2. Total years of professional experience (integer). 3. A brief professional summary.",
                                },
                                {
                                    type: "file",
                                    data: buffer,
                                    mimeType: "application/pdf",
                                },
                            ],
                        },
                    ],
                });

                if (object.skills && object.skills.length > 0) {
                    const normalized = Array.from(new Set(
                        object.skills.map(s => s.trim()).filter(Boolean)
                    ));
                    skills = normalized.join(', ');
                }
                
                experience = object.experience || 0;
                summary = object.summary || summary;
                console.log("[Resume Pipeline] Gemini extraction successful.");

            } catch (err) {
                console.error("[Resume Pipeline] Gemini Native Extraction failed:", err);
                return NextResponse.json({ 
                    error: "AI extraction failed. The PDF might be too large or complex for the current model." 
                }, { status: 500 });
            }
        } else {
            console.error("[Resume Pipeline] Configuration Error: GOOGLE_GENERATIVE_AI_API_KEY missing");
            return NextResponse.json({ error: "AI Service not configured" }, { status: 500 });
        }

        // 3. Upsert the Profile record into Prisma
        console.log("[Resume Pipeline] Saving profile to database...");
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

        console.log("[Resume Pipeline] Pipeline completed successfully.");
        return NextResponse.json({
            success: true,
            skills,
            experience,
            resumeUrl,
            message: summary
        });

    } catch (error: any) {
        console.error("[Resume Pipeline] Global Error:", error);
        return NextResponse.json({ 
            error: `Pipeline Failed: ${error.message || "Unknown error during processing"}`,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

