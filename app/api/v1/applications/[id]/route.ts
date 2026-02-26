import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * PUT /api/v1/applications/:id
 * Update application status (Recruiter only)
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { status } = await req.json();
        const validStatuses = ["Applied", "Screening", "Interview", "Offered", "Rejected"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updatedApplication = await prisma.applicant.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedApplication);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
