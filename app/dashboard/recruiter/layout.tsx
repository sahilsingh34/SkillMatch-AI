import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RecruiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/login");
    }

    let user = null;
    try {
        user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { role: true },
        });
    } catch (e) {
        console.error("Recruiter layout: DB error", e);
    }

    if (user?.role !== "RECRUITER") {
        redirect("/dashboard/profile");
    }

    return (
        <>{children}</>
    );
}
