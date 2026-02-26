import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/v1/jobs/:id/applicants
 * List applicants for a job (Recruiter only)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        const job = await prisma.job.findUnique({ where: { id } });

        if (!user || !job || job.recruiterId !== user.id) {
            return NextResponse.json({ error: "Unauthorized access to candidate data" }, { status: 403 });
        }

        const applicants = await prisma.applicant.findMany({
            where: { jobId: id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { matchScore: 'desc' }
        });

        return NextResponse.json(applicants);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
