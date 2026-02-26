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
                <p className="text-xs text-amber-400 font-medium flex items-center mr-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Delete this job?
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="h-8 text-slate-400 hover:text-white"
                >
                    No
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 bg-red-500 hover:bg-red-600 text-white"
                >
                    {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes, Delete"}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Link href={`/dashboard/recruiter/jobs/${jobId}/edit`}>
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 px-3">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(true)}
                className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 px-3"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </Button>
        </div>
    );
}
