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
import { Marquee } from "@/components/ui/marquee";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";

const companies = [
    { name: "Google", logo: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> },
    { name: "Microsoft", logo: <div className="grid grid-cols-2 gap-[2px] w-4 h-4"><div className="bg-[#f25022]"></div><div className="bg-[#7fba00]"></div><div className="bg-[#00a4ef]"></div><div className="bg-[#ffb900]"></div></div> },
    { name: "Amazon", logo: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FF9900"><path d="M13.23 10.56c0 1.27.03 2.33-.61 3.46-.52.91-1.34 1.48-2.25 1.48-1.25 0-1.98-.95-1.98-2.36 0-2.78 2.49-3.28 4.84-3.28v.7zm3.28 7.93c-.22.19-.53.21-.77.08-.54-.45-.64-.66-.94-1.09-1.79 1.83-3.06 2.38-5.39 2.38-2.75 0-4.9-1.7-4.9-5.08 0-2.65 1.43-4.45 3.48-5.33 1.77-.78 4.25-.92 6.14-1.13v-.42c0-.78.06-1.7-.4-2.37-.4-.6-1.16-.85-1.83-.85-1.25 0-2.36.64-2.63 1.96-.06.3-.28.59-.58.6l-3.24-.35c-.27-.06-.58-.28-.5-.7C5.88 2.7 9.45 1.5 12.67 1.5c1.65 0 3.82.44 5.12 1.69 1.65 1.55 1.5 3.62 1.5 5.87v5.32c0 1.6.66 2.3 1.28 3.17.22.31.27.68-.01.91-.7.58-1.94 1.67-2.62 2.27l-.43-.24z" /></svg> },
    { name: "Apple", logo: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#111827"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" /><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg> },
    { name: "Meta", logo: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0081FB"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a4.892 4.892 0 0 0 1.547 2.57c.675.59 1.509.882 2.4.882 1.077 0 2.076-.404 3.078-1.36.734-.7 1.49-1.717 2.29-3.085l.727-1.233.426.73c.96 1.636 2.06 2.87 3.282 3.517.89.47 1.81.657 2.694.657h.003c1.263 0 2.347-.554 3.16-1.53.823-.988 1.36-2.42 1.36-4.13 0-2.706-.757-5.478-2.08-7.46C17.822 3.332 16.1 2.07 14.116 2.07c-1.106 0-2.136.4-3.142 1.37-.734.71-1.49 1.727-2.29 3.1l-.726 1.24-.427-.73C6.565 5.41 5.457 4.15 4.236 3.503 3.695 3.21 3.105 3.03 2.496 3.03h-.003c-.283 0-.538.027-.578.027z" /></svg> },
    { name: "Netflix", logo: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#E50914"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z" /></svg> },
    { name: "Spotify", logo: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg> },
];

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

            {/* Logo Cloud with Marquee */}
            <section className="py-14 border-b border-slate-100 bg-white overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <BlurFade delay={0.1}>
                        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">
                            Trusted by teams at
                        </p>
                    </BlurFade>
                    <Marquee pauseOnHover className="[--duration:30s] [--gap:3rem]">
                        {companies.map((company) => (
                            <div key={company.name} className="flex items-center gap-2 mx-4">
                                {company.logo}
                                <span className="font-bold text-slate-700 text-base tracking-tight">{company.name}</span>
                            </div>
                        ))}
                    </Marquee>
                </div>
            </section>


            {/* Features Section with Magic Cards */}
            <section id="features" className="py-28 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-50/80 rounded-full blur-[200px] pointer-events-none"></div>

                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <BlurFade delay={0.1}>
                        <div className="text-center mb-20">
                            <span className="text-xs font-bold text-violet-600 uppercase tracking-[0.2em] mb-4 block">Why SkillMatch</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                                Built different. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">Built better.</span>
                            </h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Everything you need to find work or find talent — powered by AI that actually understands skills.</p>
                        </div>
                    </BlurFade>

                    <div className="grid md:grid-cols-3 gap-6">
                        <BlurFade delay={0.2}>
                            <MagicCard
                                className="rounded-2xl"
                                gradientColor="#f3e8ff"
                                gradientFrom="#8b5cf6"
                                gradientTo="#6366f1"
                                gradientOpacity={0.15}
                            >
                                <div className="p-8">
                                    <div className="h-14 w-14 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center mb-6">
                                        <UserRoundSearch className="h-7 w-7 text-violet-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Matching</h3>
                                    <p className="text-slate-500 leading-relaxed text-[15px]">
                                        Our deep learning models analyze skills, experience, and preferences to find matches with 95% accuracy — not just keyword matching.
                                    </p>
                                </div>
                            </MagicCard>
                        </BlurFade>

                        <BlurFade delay={0.3}>
                            <MagicCard
                                className="rounded-2xl"
                                gradientColor="#eff6ff"
                                gradientFrom="#3b82f6"
                                gradientTo="#6366f1"
                                gradientOpacity={0.15}
                            >
                                <div className="p-8">
                                    <div className="h-14 w-14 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-6">
                                        <Briefcase className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Resume Parsing</h3>
                                    <p className="text-slate-500 leading-relaxed text-[15px]">
                                        Upload your resume and watch our AI instantly extract and validate your skills — building a verified profile that employers trust.
                                    </p>
                                </div>
                            </MagicCard>
                        </BlurFade>

                        <BlurFade delay={0.4}>
                            <MagicCard
                                className="rounded-2xl"
                                gradientColor="#ecfeff"
                                gradientFrom="#06b6d4"
                                gradientTo="#3b82f6"
                                gradientOpacity={0.15}
                            >
                                <div className="p-8">
                                    <div className="h-14 w-14 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-cyan-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L13.5 21.75 15 13.5H3.75z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Applications</h3>
                                    <p className="text-slate-500 leading-relaxed text-[15px]">
                                        Apply to jobs in one click with your verified profile. Track every application in real-time from submission to offer.
                                    </p>
                                </div>
                            </MagicCard>
                        </BlurFade>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-28 bg-white relative overflow-hidden border-t border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <BlurFade delay={0.1}>
                        <div className="text-center mb-20">
                            <span className="text-xs font-bold text-cyan-600 uppercase tracking-[0.2em] mb-4 block">How It Works</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                                Three steps to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">next chapter</span>
                            </h2>
                        </div>
                    </BlurFade>

                    <div className="grid md:grid-cols-3 gap-8">
                        <BlurFade delay={0.2}>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white text-2xl font-extrabold mb-6 shadow-lg shadow-violet-500/20">1</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Sign up and upload your resume. Our AI instantly extracts your skills and builds a verified profile.</p>
                            </div>
                        </BlurFade>
                        <BlurFade delay={0.3}>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-extrabold mb-6 shadow-lg shadow-blue-500/20">2</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Get AI Matches</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Our algorithm analyzes thousands of opportunities and surfaces the roles that match your exact skillset.</p>
                            </div>
                        </BlurFade>
                        <BlurFade delay={0.4}>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-2xl font-extrabold mb-6 shadow-lg shadow-cyan-500/20">3</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Apply & Get Hired</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Apply with one click, track your progress in real-time, and land interviews faster than ever before.</p>
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </section>

            {/* CTA Section with ShimmerButton */}
            <section className="py-28 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/80 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <BlurFade delay={0.1}>
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                                Ready to find your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500">perfect match?</span>
                            </h2>
                            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">Join thousands of professionals and companies who are already using AI to connect smarter and faster.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/auth/signup">
                                    <ShimmerButton
                                        shimmerColor="#c4b5fd"
                                        shimmerSize="0.05em"
                                        background="linear-gradient(135deg, #7c3aed, #3b82f6)"
                                        className="px-12 py-4 text-base font-bold"
                                    >
                                        Get Started — It&apos;s Free
                                    </ShimmerButton>
                                </Link>
                                <Link href="/jobs">
                                    <Button size="lg" variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-900 rounded-full px-12 h-14 text-base font-bold shadow-sm transition-all hover:-translate-y-0.5">
                                        Explore Jobs
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>
        </div>
    );
}
