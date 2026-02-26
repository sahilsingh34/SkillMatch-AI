"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function getJobSeekerProfileAction() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        // @ts-ignore - Prisma generated types cached out of sync
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user || user.role !== "SEEKER" || !user.profile) {
            return { profile: null };
        }

        return {
            profile: {
                skills: user.profile.skills,
                experience: user.profile.experience,
                resumeUrl: user.profile.resumeUrl,
            }
        };
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return { error: "Failed to fetch profile" };
    }
}

export async function getSkillGapAnalysisAction() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        // 1. Get user profile
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user?.profile?.skills) {
            return { error: "No profile found. Upload your resume first." };
        }

        const userSkills = user.profile.skills;

        // 2. Get all job skills from the database for market analysis
        const allJobs = await prisma.job.findMany({
            select: { skills: true, title: true }
        });

        // Build a frequency map of in-demand skills
        const skillFrequency: Record<string, number> = {};
        allJobs.forEach((job: { skills: string }) => {
            job.skills.split(",").forEach((s: string) => {
                const skill = s.trim().toLowerCase();
                if (skill) skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
            });
        });

        // Sort by frequency
        const topMarketSkills = Object.entries(skillFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([skill]) => skill);

        // 3. Call Gemini for intelligent analysis
        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: `You are a career advisor AI. Analyze this job seeker's skill gap.

USER'S CURRENT SKILLS: ${userSkills}
USER'S EXPERIENCE: ${user.profile.experience} years

TOP IN-DEMAND SKILLS FROM JOB MARKET (ordered by frequency):
${topMarketSkills.join(", ")}

TOTAL JOBS IN DATABASE: ${allJobs.length}

Respond in EXACTLY this JSON format (no markdown, no code fences, just raw JSON):
{
  "profileStrength": <number 0-100 based on how well their skills match market demand>,
  "missingSkills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
  "suggestions": [
    "<actionable suggestion 1 - be specific, mention courses or technologies>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "strongSkills": ["<their best skills that are in high demand>"],
  "summary": "<brief 2-sentence career insight>"
}`
        });

        // Parse the AI response
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const analysis = JSON.parse(cleaned);

        return {
            success: true,
            analysis: {
                profileStrength: Math.min(100, Math.max(0, analysis.profileStrength)),
                missingSkills: analysis.missingSkills || [],
                suggestions: analysis.suggestions || [],
                strongSkills: analysis.strongSkills || [],
                summary: analysis.summary || "",
                totalJobs: allJobs.length,
            }
        };
    } catch (error) {
        console.error("Skill gap analysis failed:", error);
        return { error: "Failed to generate skill gap analysis. Please try again." };
    }
}
