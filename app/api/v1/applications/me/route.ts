import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/v1/applications/me
 * List my applications (Seeker)
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const applications = await prisma.applicant.findMany({
            where: { userId: user.id },
            include: {
                job: true
            },
            orderBy: { appliedAt: 'desc' }
        });

        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
