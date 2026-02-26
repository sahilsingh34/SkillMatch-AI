import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                recruiter: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user || user.role !== 'RECRUITER') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job || job.recruiterId !== user.id) {
            return NextResponse.json({ error: "Unauthorized access to job" }, { status: 401 });
        }

        const body = await req.json();
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                location: body.location,
                salary: body.salary,
                type: body.type,
                company: body.company
            }
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user || user.role !== 'RECRUITER') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job || job.recruiterId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.job.delete({ where: { id } });

        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
