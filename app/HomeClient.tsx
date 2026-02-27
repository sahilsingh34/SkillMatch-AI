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

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Hero />

            {/* Logo Cloud Section - Moved up for better social proof */}
            <section className="py-12 border-b border-slate-100 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
                        Trusted by innovative teams worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {["TechNova", "GlobalSystems", "InnovateCorp", "FutureLabs", "CloudWorks"].map((company) => (
                            <div key={company} className="text-xl font-bold font-mono text-slate-800 flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-slate-200"></div>
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rest of the homepage content below (Features, CTA, Footer) */}
            <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-16 tracking-tight">
                        Unlock Your Potential with <span className="text-blue-600 italic">SkillMatch</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100"
                        >
                            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <UserRoundSearch className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Matching</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our intelligent algorithms connect job seekers with roles that truly fit their skills and aspirations, and recruiters with the perfect candidates.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100"
                        >
                            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Skills</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Showcase your abilities with verified skill assessments, giving employers confidence in your capabilities.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100"
                        >
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L13.5 21.75 15 13.5H3.75z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Streamlined Workflow</h3>
                            <p className="text-slate-600 leading-relaxed">
                                From application to hiring, our platform simplifies every step, saving time for both job seekers and recruiters.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

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
