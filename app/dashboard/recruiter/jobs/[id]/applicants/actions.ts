"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendApplicationStatusEmail } from "@/lib/email";

export async function updateApplicantStatusAction(applicantId: string, newStatus: string) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return { error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user || user.role !== "RECRUITER") {
            return { error: "Permission denied" };
        }

        const applicant = await prisma.applicant.findUnique({
            where: { id: applicantId },
            include: { job: true, user: true }
        });

        if (!applicant) {
            return { error: "Applicant not found" };
        }

        if (applicant.job.recruiterId !== user.id) {
            return { error: "You do not have permission to manage this applicant pipeline." };
        }

        await prisma.applicant.update({
            where: { id: applicantId },
            data: { status: newStatus }
        });

        revalidatePath(`/dashboard/recruiter/jobs/${applicant.jobId}/applicants`);

        // Trigger email notification asynchronously (fire and forget)
        sendApplicationStatusEmail(
            applicant.user.email,
            applicant.job.title,
            applicant.job.company,
            newStatus,
            applicant.user.firstName || applicant.user.email.split('@')[0]
        ).catch((err) => console.error("Could not dispatch status email:", err));

        return { success: true };

    } catch (error) {
        console.error("Failed to update status mutation:", error);
        return { error: "Failed to update candidate status" };
    }
}
