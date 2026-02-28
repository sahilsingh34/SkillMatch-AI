import React from 'react';
import { RetroGrid } from "@/components/ui/retro-grid";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white dark:bg-neutral-950">
            <RetroGrid className="opacity-50" />
            <div className="relative flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-neutral-200 dark:border-neutral-800 border-t-blue-600 animate-spin mb-4" />
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 animate-pulse">
                    SkillMatch AI is loading...
                </p>
            </div>
        </div>
    );
}
