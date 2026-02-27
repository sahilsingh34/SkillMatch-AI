"use client";

import { useState, useEffect } from "react";
import { assignUserRoleAction } from "./actions";
import { useRouter } from "next/navigation";
import { Briefcase, UserRoundSearch, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Particles } from "@/components/ui/particles";

export default function OnboardingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"SEEKER" | "RECRUITER" | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    // Auto-select role if preferred_role is stored in localStorage
    useEffect(() => {
        const preferredRole = localStorage.getItem("preferred_role") as "SEEKER" | "RECRUITER" | null;
        if (preferredRole === "SEEKER" || preferredRole === "RECRUITER") {
            // Remove it right away so it doesn't run again if they navigate back
            localStorage.removeItem("preferred_role");
            // Automatically trigger the selection
            handleRoleSelection(preferredRole, true);
        }
    }, []);

    const handleRoleSelection = async (role: "SEEKER" | "RECRUITER", isAuto: boolean = false) => {
        setSelectedRole(role);
        setIsLoading(true);
        try {
            const result = await assignUserRoleAction(role);
            if (result.success && result.redirectTo) {
                toast({
                    title: "Welcome aboard! 🎉",
                    description: "Your " + (role === "SEEKER" ? "Job Seeker" : "Recruiter") + " profile is ready.",
                });
                router.push(result.redirectTo);
            } else {
                if (!isAuto) {
                    toast({
                        title: "Error",
                        description: result.error || "Failed to set role. Please try again.",
                    });
                }
                setIsLoading(false);
                setSelectedRole(null);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setSelectedRole(null);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
            <Particles className="absolute inset-0 z-0" quantity={50} ease={80} color="#a78bfa" size={0.4} staticity={50} />

            <div className="relative z-10 max-w-2xl w-full text-center px-6">
                <BlurFade delay={0.1}>
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-6 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-full border border-neutral-200">
                        <Sparkles className="w-3.5 h-3.5" />
                        One last step
                    </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black leading-[1.1] mb-4">
                        How will you use<br />SkillMatch AI?
                    </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <p className="text-neutral-500 text-base mb-12 max-w-md mx-auto">
                        We'll customize your entire experience based on your choice. Pick the one that best describes you.
                    </p>
                </BlurFade>

                <div className="grid sm:grid-cols-2 gap-5">
                    <BlurFade delay={0.4}>
                        <button
                            onClick={() => handleRoleSelection("SEEKER")}
                            disabled={isLoading}
                            className={`relative group w-full text-left p-7 rounded-2xl border-2 bg-white transition-all duration-300 disabled:opacity-60 ${selectedRole === "SEEKER"
                                ? "border-blue-500 shadow-lg shadow-blue-500/10"
                                : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
                                }`}
                        >
                            {selectedRole === "SEEKER" && (
                                <BorderBeam size={150} duration={6} colorFrom="#3b82f6" colorTo="#8b5cf6" />
                            )}
                            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <UserRoundSearch className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-1.5">I'm looking for a job</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                                Find top roles matching your verified skills. Let AI connect you with the right employers.
                            </p>
                            <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                                Get started <ArrowRight className="w-3 h-3" />
                            </div>
                        </button>
                    </BlurFade>

                    <BlurFade delay={0.5}>
                        <button
                            onClick={() => handleRoleSelection("RECRUITER")}
                            disabled={isLoading}
                            className={`relative group w-full text-left p-7 rounded-2xl border-2 bg-white transition-all duration-300 disabled:opacity-60 ${selectedRole === "RECRUITER"
                                ? "border-violet-500 shadow-lg shadow-violet-500/10"
                                : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
                                }`}
                        >
                            {selectedRole === "RECRUITER" && (
                                <BorderBeam size={150} duration={6} colorFrom="#8b5cf6" colorTo="#ec4899" />
                            )}
                            <div className="h-12 w-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-1.5">I'm hiring talent</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                                Post jobs, discover AI-matched candidates, and manage your pipeline efficiently.
                            </p>
                            <div className="flex items-center gap-1 text-xs font-medium text-violet-600">
                                Get started <ArrowRight className="w-3 h-3" />
                            </div>
                        </button>
                    </BlurFade>
                </div>

                <BlurFade delay={0.6}>
                    <p className="text-xs text-neutral-400 mt-8">
                        This choice cannot be changed later. Choose carefully.
                    </p>
                </BlurFade>
            </div>
        </div>
    );
}
