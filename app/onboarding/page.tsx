"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { assignUserRoleAction } from "./actions";
import { useRouter } from "next/navigation";
import { Briefcase, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleRoleSelection = async (role: "SEEKER" | "RECRUITER") => {
        setIsLoading(true);
        try {
            const result = await assignUserRoleAction(role);
            if (result.success && result.redirectTo) {
                toast({
                    title: "Welcome aboard! \uD83C\uDF89",
                    description: "Your " + (role === "SEEKER" ? "Job Seeker" : "Recruiter") + " profile is ready.",
                });
                router.push(result.redirectTo);
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to set role. Please try again.",
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 p-4 bg-background">
            <div className="max-w-3xl w-full text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        How do you want to use SkillMatch AI?
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        We'll customize your experience based on your choice. You can't change this later.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <button
                            onClick={() => handleRoleSelection("SEEKER")}
                            disabled={isLoading}
                            className="w-full relative group h-full p-8 rounded-3xl border-2 border-muted bg-card hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-4 disabled:opacity-50"
                        >
                            <div className="h-16 w-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserRoundSearch className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold">I'm looking for a job</h3>
                            <p className="text-muted-foreground text-sm">
                                Find top roles matching your verified skills. Let AI connect you with employers who value what you can actually do.
                            </p>
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <button
                            onClick={() => handleRoleSelection("RECRUITER")}
                            disabled={isLoading}
                            className="w-full relative group h-full p-8 rounded-3xl border-2 border-muted bg-card hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-4 disabled:opacity-50"
                        >
                            <div className="h-16 w-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold">I'm hiring talent</h3>
                            <p className="text-muted-foreground text-sm">
                                Post jobs, discover highly matched candidates, and manage your pipeline efficiently with AI.
                            </p>
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
