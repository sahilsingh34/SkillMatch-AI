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

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
    });

    if (user?.role !== "SEEKER") {
        redirect("/dashboard/recruiter");
    }

    return (
        <>{children}</>
    );
}
