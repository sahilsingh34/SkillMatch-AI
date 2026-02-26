import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
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
        console.error("Profile layout: DB error", e);
        redirect("/dashboard/profile"); // stay on page, let the page handle it
    }

    if (user?.role !== "SEEKER") {
        redirect("/dashboard/recruiter");
    }

    return (
        <>{children}</>
    );
}
