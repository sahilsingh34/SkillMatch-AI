"use client";

import { useState, useTransition } from "react";
import { updateApplicantStatusAction } from "./actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_STAGES = [
    "Applied",
    "Screening",
    "Interview",
    "Offered",
    "Rejected"
];

export function StatusDropdown({
    applicantId,
    currentStatus
}: {
    applicantId: string,
    currentStatus: string
}) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;

        startTransition(async () => {
            const result = await updateApplicantStatusAction(applicantId, newStatus);

            if (result.error) {
                toast({
                    title: "Access Denied",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Status Updated",
                    description: `Candidate moved to ${newStatus}`,
                });
            }
        });
    };

    return (
        <div className="relative">
            <select
                title="Change applicant status"
                disabled={isPending}
                value={currentStatus}
                onChange={handleStatusChange}
                className={`
                    appearance-none bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 text-black dark:text-white text-[11px] font-bold px-3 py-1.5 pr-8 rounded-full outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer transition-all uppercase tracking-wider shadow-sm hover:shadow-md
                    ${isPending && 'opacity-50 cursor-not-allowed'}
                `}
            >
                {STATUS_STAGES.map(stage => (
                    <option key={stage} value={stage} className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-bold">
                        {stage}
                    </option>
                ))}
            </select>

            {/* Custom dropdown arrow to replace native styling */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400 dark:text-neutral-500">
                {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin text-black dark:text-white" />
                ) : (
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                )}
            </div>
        </div>
    );
}
