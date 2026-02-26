import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/v1/ai/recommendations
 * Get AI matched jobs for the current seeker
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user?.profile?.skills) {
            return NextResponse.json({ error: "Profile skills required for recommendations" }, { status: 400 });
        }

        const userSkills = user.profile.skills.toLowerCase().split(",").map((s: string) => s.trim());

        // Simple vector-like matching for the API
        const allJobs = await prisma.job.findMany({
            take: 20,
            orderBy: { postedAt: 'desc' }
        });

        const scoredJobs = allJobs.map(job => {
            const jobSkills = job.skills.toLowerCase().split(",").map((s: string) => s.trim());
            const matches = jobSkills.filter(s => userSkills.includes(s));
            const matchScore = jobSkills.length > 0 ? Math.round((matches.length / jobSkills.length) * 100) : 0;
            return {
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                matchScore: Math.max(10, matchScore)
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        return NextResponse.json(scoredJobs);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
