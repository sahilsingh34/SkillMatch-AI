"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { assignUserRoleAction } from "./onboarding/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Hero } from "@/components/landing/Hero";

export function HomeClient({ userRole }: { userRole: string | null | undefined }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleRoleSelection = async (role: "SEEKER" | "RECRUITER") => {
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
                toast({ title: "Error", description: "Failed to set role. Please try again." });
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // --- HERO: Role Selection ---
    if (userRole === null) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[#111827]">
                            How do you want to use <span className="text-blue-600 italic">SkillMatch</span>?
                        </h1>
                        <p className="text-xl text-slate-500 mb-12">
                            We&apos;ll customize your experience based on your choice.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <motion.button
                                onClick={() => handleRoleSelection("SEEKER")}
                                disabled={isLoading}
                                className="relative group w-full p-8 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex flex-col items-start gap-4 disabled:opacity-50 cursor-pointer overflow-hidden text-left shadow-sm"
                            >
                                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100">
                                    <UserRoundSearch className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">I&apos;m looking for a job</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Find top roles matching your verified skills. Let AI connect you with employers who value what you can do.
                                </p>
                            </motion.button>

                            <motion.button
                                onClick={() => handleRoleSelection("RECRUITER")}
                                disabled={isLoading}
                                className="relative group w-full p-8 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex flex-col items-start gap-4 disabled:opacity-50 cursor-pointer overflow-hidden text-left shadow-sm"
                            >
                                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-indigo-100">
                                    <Briefcase className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">I&apos;m hiring talent</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Post jobs, discover highly matched candidates, and manage your pipeline efficiently with AI.
                                </p>
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white relative">
            <Hero />

            {/* Keeping the CTA section but adapting to light theme */}
            <section className="py-24 border-t border-slate-100 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-slate-50 rounded-[40px] p-16 relative overflow-hidden group border border-slate-200"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                            Ready to transform your <br />
                            <span className="text-blue-600 italic">career journey?</span>
                        </h2>

                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-[#111827] text-white hover:bg-black rounded-xl px-10 h-14 text-base font-black border-none transition-all hover:-translate-y-0.5 shadow-xl shadow-black/10">
                                Start Your Journey Now
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
