"use server";

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';

export async function createJobAction(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const company = formData.get("company") as string;
        const location = formData.get("location") as string;
        const type = formData.get("type") as string;
        const salary = formData.get("salary") as string;
        const description = formData.get("description") as string;

        if (!title || !company || !description) {
            return { error: "Title, Company, and Description are required." };
        }

        const { userId } = await auth();
        if (!userId) {
            return { error: "Unauthorized. Please log in as a Recruiter." };
        }

        // Fetch or sync the Recruiter user in DB
        let recruiter = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!recruiter) {
            recruiter = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: `user_${userId}@clerk.local`,
                    role: 'RECRUITER'
                }
            });
        }

        // AI Skill Extraction from Job Description
        let extractedSkills: string[] = [];
        const hasGeminiKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (hasGeminiKey) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);
                const schema = {
                    type: SchemaType.OBJECT,
                    properties: {
                        skills: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: "A list of 5-10 core technical and soft skills required for the job."
                        }
                    },
                    required: ["skills"]
                };

                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: schema as any,
                    }
                });

                const prompt = `You are an expert technical recruiter. Analyze the following job description and extract 5 to 10 core skills (e.g. 'React', 'Project Management') required for this role.\n\nDescription:\n${description}`;
                const result = await model.generateContent(prompt);
                const parsedResult = JSON.parse(result.response.text());
                
                // Normalize skills: lowercase and unique
                const rawSkills = (parsedResult.skills || []).map((s: string) => s.trim().toLowerCase()).filter(Boolean);
                extractedSkills = Array.from(new Set(rawSkills)) as string[];
            } catch (aiError) {
                console.error("Failed to extract skills via Gemini:", aiError);
                extractedSkills = ["communication", "problem solving"];
            }
        } else {
            extractedSkills = ["communication", "problem solving"];
        }

        const skillsString = extractedSkills.length > 0 ? extractedSkills.join(', ') : "generalist";

        // Create Job in Prisma SQLite
        const newJob = await prisma.job.create({
            data: {
                title,
                company,
                location: location || "Remote",
                type: type || "Full-time",
                salary: salary || "Competitive",
                skills: skillsString,
                description,
                recruiterId: recruiter.id
            }
        });

        // Revalidate paths so the new job appears on the listings page
        revalidatePath("/jobs");
        revalidatePath("/dashboard/recruiter");

        return { success: true, jobId: newJob.id, skills: extractedSkills };
    } catch (error) {
        console.error("Job creation failed:", error);
        return { error: "Failed to create job posting. Please try again." };
    }
}
