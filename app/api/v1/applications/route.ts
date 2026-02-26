import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

/**
 * POST /api/v1/applications
 * Apply to a job (Seeker only)
 */
export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user || user.role !== 'SEEKER' || !user.profile) {
            return NextResponse.json({ error: "Seeker profile not found. Please upload resume first." }, { status: 400 });
        }

        const { jobId } = await req.json();
        if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        // Calculate Match Score via AI
        let matchScore = 50;
        try {
            const { text } = await generateText({
                model: google("gemini-1.5-flash"),
                prompt: `Rate match from 0-100 between Candidate Skills: ${user.profile.skills} and Job Required Skills: ${job.skills}. Return only the integer score.`
            });
            matchScore = parseInt(text.trim()) || 50;
        } catch (aiError) {
            console.error("AI Match Score error:", aiError);
        }

        const application = await prisma.applicant.create({
            data: {
                jobId: job.id,
                userId: user.id,
                matchScore,
                skills: user.profile.skills,
                experience: user.profile.experience,
                status: "Applied"
            }
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error("API Applications POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
