"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toggleSaveJobAction } from './saved-actions';
import { useRouter } from 'next/navigation';

export function SaveJobButton({ jobId, initialSaved }: { jobId: string, initialSaved: boolean }) {
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        setIsLoading(true);
        const result = await toggleSaveJobAction(jobId);
        if (result.success) {
            setIsSaved(result.saved);
            router.refresh();
        } else {
            alert(result.error || "Failed to save job");
        }
        setIsLoading(false);
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggle();
            }}
            disabled={isLoading}
            className={`rounded-full transition-all duration-300 ${isSaved ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-800'}`}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : isSaved ? (
                <BookmarkCheck className="h-5 w-5 fill-current" />
            ) : (
                <Bookmark className="h-5 w-5" />
            )}
        </Button>
    );
}
