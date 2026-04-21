import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
const PDFParser = require("pdf2json");

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
            // Fetch Clerk user details for auto-creation
            const clerkUser = await currentUser();
            const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `seeker_${clerkId}@clerk.local`;
            const firstName = clerkUser?.firstName;
            const lastName = clerkUser?.lastName;

            // Auto-create the Seeker's core record if this is their first action
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
            .upload(filePath, buffer, { // USE BUFFER, NOT FILE OBJECT
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
        let extractedText = "";

        if (file.type === "application/pdf") {
            extractedText = await new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1);

                pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
                pdfParser.on("pdfParser_dataReady", () => {
                    resolve(pdfParser.getRawTextContent());
                });

                pdfParser.parseBuffer(buffer);
            });
        } else {
            return NextResponse.json({ error: "Unsupported file type for MVP" }, { status: 400 });
        }

        // 3. Extract core skills & experience using Google Gemini
        let skills = "Unable to extract";
        let experience = 0;

        if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            const prompt = `
            You are an expert HR API. Extract the following from this resume text:
            1. A comma-separated list of the top 5-10 technical/professional skills.
            2. Give me a single integer representing the total years of professional experience across all roles.

            Format your response EXACTLY like this with no markdown or intro:
            SKILLS: React, Node.js, TypeScript, Next.js, Python
            EXPERIENCE: 4

            Resume Text:
            ${extractedText.substring(0, 15000)} // Truncate to save tokens
            `;

            try {
                const { text: aiResponse } = await generateText({
                    model: google("gemini-1.5-flash"),
                    prompt: prompt,
                });

                const skillsMatch = aiResponse.match(/SKILLS:\s*(.+)/i);
                const expMatch = aiResponse.match(/EXPERIENCE:\s*(\d+)/i);

                if (skillsMatch) {
                    // Normalize skills: lowercase, trim, and unique
                    const rawSkills = skillsMatch[1].split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                    skills = Array.from(new Set(rawSkills)).join(', ');
                }
                
                if (expMatch) {
                    experience = parseInt(expMatch[1].trim(), 10);
                }
            } catch (err) {
                console.error("Gemini Extraction failed:", err);
            }
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
            message: "Profile successfully extracted and saved."
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to process resume pipeline" }, { status: 500 });
    }
}
