"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createApplicationAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function ApplyNowButton({ jobId, alreadyApplied = false }: { jobId: string, alreadyApplied?: boolean }) {
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(alreadyApplied);
    const { toast } = useToast();

    const handleApply = async () => {
        setIsApplying(true);
        try {
            const result = await createApplicationAction(jobId);

            if (result.success) {
                setHasApplied(true);
                toast({
                    title: "Application Submitted!",
                    description: "Your AI-extracted profile has been sent to the recruiter.",
                });
            } else {
                toast({
                    title: "Application Failed",
                    description: result.error || "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            toast({
                title: "Application Error",
                description: "Failed to connect to the server.",
                variant: "destructive",
            });
        } finally {
            setIsApplying(false);
        }
    };

    if (hasApplied) {
        return (
            <Button size="lg" className="w-full mb-4 font-semibold text-lg" disabled variant="secondary">
                Applied
            </Button>
        );
    }

    return (
        <Button
            size="lg"
            className="w-full mb-4 font-bold text-[15px] h-14 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            onClick={handleApply}
            disabled={isApplying}
        >
            {isApplying ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Applying...
                </>
            ) : "Apply Now"}
        </Button>
    );
}
