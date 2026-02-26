"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

/**
 * AI-Enhanced Match Score Calculator
 * Uses Gemini to semantically compare user skills against job requirements
 * Falls back to basic string matching if Gemini is unavailable
 */
async function calculateAIMatchScore(
    jobTitle: string,
    jobSkills: string,
    jobDescription: string,
    userSkills: string,
    userExperience: number
): Promise<number> {
    try {
        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: `You are a recruitment AI. Calculate the match score between this candidate and job.

JOB TITLE: ${jobTitle}
JOB REQUIRED SKILLS: ${jobSkills}
JOB DESCRIPTION: ${jobDescription.substring(0, 500)}

CANDIDATE SKILLS: ${userSkills}
CANDIDATE EXPERIENCE: ${userExperience} years

Score the match from 0 to 100 considering:
1. Direct skill matches (exact matches like "React" = "React")
2. Semantic similarity (e.g., "React.js" ≈ "React", "Node" ≈ "Node.js", "ML" ≈ "Machine Learning")
3. Related skills (e.g., "TypeScript" relates to "JavaScript")
4. Experience level appropriateness
5. Overall profile fit

Respond with ONLY a single integer number between 10 and 100. Nothing else.`
        });

        const score = parseInt(text.trim(), 10);
        if (isNaN(score) || score < 10 || score > 100) {
            return fallbackMatchScore(jobSkills, userSkills);
        }
        return score;
    } catch (e) {
        console.error("AI match score failed, using fallback:", e);
        return fallbackMatchScore(jobSkills, userSkills);
    }
}

/** Basic string-matching fallback */
function fallbackMatchScore(jobSkills: string, userSkills: string): number {
    const jobArr = jobSkills.toLowerCase().split(',').map((s: string) => s.trim());
    const userArr = userSkills.toLowerCase().split(',').map((s: string) => s.trim());

    let matchCount = 0;
    jobArr.forEach((reqSkill: string) => {
        if (userArr.some((us: string) => us.includes(reqSkill) || reqSkill.includes(us))) {
            matchCount++;
        }
    });

    let score = jobArr.length > 0 ? Math.round((matchCount / jobArr.length) * 100) : 100;
    if (score < 10) score = 10;
    return score;
}

export async function createApplicationAction(jobId: string) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return { success: false, error: "Unauthorized. Please log in first." };
        }

        // @ts-ignore - Prisma generated types cached out of sync
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user) {
            return { success: false, error: "User not found." };
        }

        if (!user.profile) {
            return { success: false, error: "Please complete your profile (upload resume) before applying." };
        }

        // 2. Fetch the Job to compare skills
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return { success: false, error: "Job not found." };
        }

        // 3. Prevent duplicate applications
        const existingApp = await prisma.applicant.findUnique({
            where: {
                jobId_userId: {
                    jobId: job.id,
                    userId: user.id
                }
            }
        });

        if (existingApp) {
            return { success: false, error: "You have already applied to this position." };
        }

        // 4. Calculate AI-enhanced Match Score
        const score = await calculateAIMatchScore(
            job.title,
            job.skills,
            job.description,
            user.profile.skills,
            user.profile.experience
        );

        // 5. Insert Application Request
        await prisma.applicant.create({
            data: {
                jobId: job.id,
                userId: user.id,
                matchScore: score,
                skills: user.profile.skills,
                experience: user.profile.experience,
                status: "Applied"
            }
        });

        revalidatePath(`/dashboard/recruiter`);
        revalidatePath(`/dashboard/recruiter/jobs/${job.id}/applicants`);

        return { success: true, matchScore: score };

    } catch (error) {
        console.error("Error creating application:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
