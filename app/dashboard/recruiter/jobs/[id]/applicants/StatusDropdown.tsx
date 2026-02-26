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
                    appearance-none bg-slate-900 border text-xs font-semibold px-3 py-1 pr-8 rounded-full outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer transition-colors
                    ${currentStatus === 'Applied' && 'border-slate-600 text-slate-300'}
                    ${currentStatus === 'Screening' && 'border-blue-500/50 text-blue-400 bg-blue-500/10'}
                    ${currentStatus === 'Interview' && 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10'}
                    ${currentStatus === 'Offered' && 'border-green-500/50 text-green-400 bg-green-500/10'}
                    ${currentStatus === 'Rejected' && 'border-red-500/50 text-red-400 bg-red-500/10'}
                    ${isPending && 'opacity-50 cursor-not-allowed'}
                `}
            >
                {STATUS_STAGES.map(stage => (
                    <option key={stage} value={stage} className="bg-slate-800 text-white">
                        {stage}
                    </option>
                ))}
            </select>

            {/* Custom dropdown arrow to replace native styling */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                )}
            </div>
        </div>
    );
}
