"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { deleteJobAction } from './jobs/actions';
import { useRouter } from 'next/navigation';

export function JobManagementButtons({ jobId }: { jobId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteJobAction(jobId);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Failed to delete job");
            setIsDeleting(false);
            setShowConfirm(false);
        }
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                <p className="text-xs text-black dark:text-white font-bold flex items-center mr-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Delete this job?
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="h-8 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    No
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes, Delete"}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Link href={`/dashboard/recruiter/jobs/${jobId}/edit`}>
                <Button variant="outline" size="sm" className="bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-neutral-800 text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 px-3 transition-colors">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(true)}
                className="text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3 transition-colors"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </Button>
        </div>
    );
}
