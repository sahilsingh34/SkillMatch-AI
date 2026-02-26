import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/v1/users/me
 * Get current user profile and role
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                profile: true
            } as any
        }) as any;

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profile: user.profile
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
