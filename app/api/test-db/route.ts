import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "No Clerk user ID found in session" }, { status: 401 });
        }

        const email = `test_recovery_${userId}@clerk.local`;
        const role = "SEEKER";

        console.log("Attempting upsert for:", { clerkId: userId, role, email });

        const result = await prisma.user.upsert({
            where: { clerkId: userId },
            update: { role },
            create: {
                clerkId: userId,
                email,
                role,
            },
        });

        return NextResponse.json({ success: true, result });
    } catch (e: any) {
        console.error("Manual test upsert failed:", e);
        return NextResponse.json({
            success: false,
            error: e.message,
            code: e.code,
            meta: e.meta
        }, { status: 500 });
    }
}
