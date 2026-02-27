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
            <Hero userRole={userRole} />

            {/* Logo Cloud Section */}
            <section className="py-12 border-b border-slate-100 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
                        Trusted by innovative teams worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Google */}
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            <span className="font-bold text-slate-700 text-lg tracking-tight">Google</span>
                        </div>
                        {/* Microsoft */}
                        <div className="flex items-center gap-2">
                            <div className="grid grid-cols-2 gap-[2px] w-5 h-5">
                                <div className="bg-[#f25022]"></div><div className="bg-[#7fba00]"></div>
                                <div className="bg-[#00a4ef]"></div><div className="bg-[#ffb900]"></div>
                            </div>
                            <span className="font-bold text-slate-700 text-lg tracking-tight">Microsoft</span>
                        </div>
                        {/* Amazon */}
                        <div className="flex items-center gap-1.5">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#FF9900"><path d="M13.23 10.56c0 1.27.03 2.33-.61 3.46-.52.91-1.34 1.48-2.25 1.48-1.25 0-1.98-.95-1.98-2.36 0-2.78 2.49-3.28 4.84-3.28v.7zm3.28 7.93c-.22.19-.53.21-.77.08-.54-.45-.64-.66-.94-1.09-1.79 1.83-3.06 2.38-5.39 2.38-2.75 0-4.9-1.7-4.9-5.08 0-2.65 1.43-4.45 3.48-5.33 1.77-.78 4.25-.92 6.14-1.13v-.42c0-.78.06-1.7-.4-2.37-.4-.6-1.16-.85-1.83-.85-1.25 0-2.36.64-2.63 1.96-.06.3-.28.59-.58.6l-3.24-.35c-.27-.06-.58-.28-.5-.7C5.88 2.7 9.45 1.5 12.67 1.5c1.65 0 3.82.44 5.12 1.69 1.65 1.55 1.5 3.62 1.5 5.87v5.32c0 1.6.66 2.3 1.28 3.17.22.31.27.68-.01.91-.7.58-1.94 1.67-2.62 2.27l-.43-.24z" /></svg>
                            <span className="font-bold text-slate-700 text-lg tracking-tight">Amazon</span>
                        </div>
                        {/* Meta */}
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#0081FB"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a4.892 4.892 0 0 0 1.547 2.57c.675.59 1.509.882 2.4.882 1.077 0 2.076-.404 3.078-1.36.734-.7 1.49-1.717 2.29-3.085l.727-1.233.426.73c.96 1.636 2.06 2.87 3.282 3.517.89.47 1.81.657 2.694.657h.003c1.263 0 2.347-.554 3.16-1.53.823-.988 1.36-2.42 1.36-4.13 0-2.706-.757-5.478-2.08-7.46C17.822 3.332 16.1 2.07 14.116 2.07c-1.106 0-2.136.4-3.142 1.37-.734.71-1.49 1.727-2.29 3.1l-.726 1.24-.427-.73C6.565 5.41 5.457 4.15 4.236 3.503 3.695 3.21 3.105 3.03 2.496 3.03h-.003c-.283 0-.538.027-.578.027z" /></svg>
                            <span className="font-bold text-slate-800 text-lg tracking-tight">Meta</span>
                        </div>
                        {/* Apple */}
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#111827"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" /><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                            <span className="font-bold text-slate-800 text-lg tracking-tight">Apple</span>
                        </div>
                        {/* Netflix */}
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#E50914"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z" /></svg>
                            <span className="font-bold text-slate-800 text-lg tracking-tight">Netflix</span>
                        </div>
                        {/* Spotify */}
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                            <span className="font-bold text-slate-800 text-lg tracking-tight">Spotify</span>
                        </div>
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
