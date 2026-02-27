"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, UserRoundSearch, Zap, Shield, Clock, Heart, Layers, HelpCircle, DollarSign, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { assignUserRoleAction } from "./onboarding/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/ui/marquee";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";

const testimonials = [
    { name: "Priya Sharma", role: "Software Engineer", text: "Absolutely revolutionary. SkillMatch AI matched me with my dream job within a week. The AI skill matching is incredibly accurate." },
    { name: "Cathy Lee", role: "Product Manager", text: "I can't imagine going back to how things were before this tool. It has not only improved my hiring workflow but also my daily life." },
    { name: "Grace Hall", role: "Marketing Specialist", text: "It's incredibly intuitive and easy to use. Even those without technical expertise can leverage its power to improve their workflows." },
    { name: "Eva Green", role: "Operations Director", text: "The efficiency it brings is unmatched. It's a vital tool that has helped us cut costs and improve our end product significantly." },
    { name: "Frank Moore", role: "Project Manager", text: "A robust solution that fits perfectly into our workflow. It has enhanced our team's capabilities and allowed us to tackle more complex projects." },
    { name: "Mia Turner", role: "Systems Integrator", text: "It's simply revolutionary! The way it integrates with our existing systems and enhances them is nothing short of miraculous." },
    { name: "Henry Ford", role: "Talent Analyst", text: "It has saved us countless hours. Highly recommended for anyone looking to enhance their efficiency and productivity." },
    { name: "Ivy Wilson", role: "Business Consultant", text: "A must-have tool for any professional. It's revolutionized the way we approach talent acquisition and skill matching." },
    { name: "Samuel Lee", role: "Futurist", text: "It's the future, now. Adopting this AI has put us years ahead of the competition in terms of operational efficiency and innovation." },
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

            {/* ===== TRUSTED BY SECTION ===== */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <BlurFade delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-3 tracking-tight">
                            Trusted by the best companies
                        </h2>
                        <p className="text-center text-neutral-500 text-sm mb-14">
                            SkillMatch AI is the choice of all the Fortune 500 companies.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
                            {/* Netflix */}
                            <div className="flex items-center gap-1">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#E50914"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z" /></svg>
                                <span className="font-black text-xl tracking-tighter text-[#E50914]">NETFLIX</span>
                            </div>
                            {/* Google */}
                            <div className="flex items-center">
                                <span className="text-2xl font-medium tracking-tight"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>
                            </div>
                            {/* Meta */}
                            <div className="flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#0081FB"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a4.892 4.892 0 0 0 1.547 2.57c.675.59 1.509.882 2.4.882 1.077 0 2.076-.404 3.078-1.36.734-.7 1.49-1.717 2.29-3.085l.727-1.233.426.73c.96 1.636 2.06 2.87 3.282 3.517.89.47 1.81.657 2.694.657h.003c1.263 0 2.347-.554 3.16-1.53.823-.988 1.36-2.42 1.36-4.13 0-2.706-.757-5.478-2.08-7.46C17.822 3.332 16.1 2.07 14.116 2.07c-1.106 0-2.136.4-3.142 1.37-.734.71-1.49 1.727-2.29 3.1l-.726 1.24-.427-.73C6.565 5.41 5.457 4.15 4.236 3.503 3.695 3.21 3.105 3.03 2.496 3.03h-.003c-.283 0-.538.027-.578.027z" /></svg>
                                <span className="text-xl font-semibold text-black">Meta</span>
                            </div>
                            {/* Apple */}
                            <div className="flex items-center gap-1">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="black"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" /><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                <span className="text-xl font-semibold text-black">Apple</span>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* ===== PACKED WITH FEATURES (Bento) ===== */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <BlurFade delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-3 tracking-tight">
                            Packed with thousands of features
                        </h2>
                        <p className="text-center text-neutral-500 text-sm mb-14 max-w-xl mx-auto">
                            From AI skill matching to resume parsing, SkillMatch AI has tools for literally everything. It can even find your perfect career path.
                        </p>
                    </BlurFade>

                    <div className="grid md:grid-cols-2 gap-6">
                        <BlurFade delay={0.2}>
                            <div className="rounded-2xl border border-neutral-200 bg-white p-8 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-black mb-2">AI-Powered Skill Matching</h3>
                                <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                                    Match candidates with jobs based on verified skills, not just keywords. Our deep learning models achieve 95% accuracy.
                                </p>
                                <div className="bg-neutral-50 rounded-xl p-6 flex items-center justify-center min-h-[200px] border border-neutral-100">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                                            <UserRoundSearch className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex gap-1 mt-2">
                                            <div className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">React</div>
                                            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">TypeScript</div>
                                            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Node.js</div>
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-1">95% Match</p>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.3}>
                            <div className="rounded-2xl border border-neutral-200 bg-white p-8 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-black mb-2">Smart Resume Parsing</h3>
                                <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                                    Upload your resume and our AI instantly extracts skills, experience, and builds a verified professional profile.
                                </p>
                                <div className="bg-neutral-50 rounded-xl p-6 min-h-[200px] border border-neutral-100">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-neutral-100">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">JS</div>
                                            <div>
                                                <p className="text-sm font-medium text-black">JavaScript</p>
                                                <p className="text-xs text-neutral-400">5 years • Expert</p>
                                            </div>
                                            <div className="ml-auto text-xs text-emerald-600 font-medium">✓ Verified</div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-neutral-100">
                                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600">TS</div>
                                            <div>
                                                <p className="text-sm font-medium text-black">TypeScript</p>
                                                <p className="text-xs text-neutral-400">3 years • Advanced</p>
                                            </div>
                                            <div className="ml-auto text-xs text-emerald-600 font-medium">✓ Verified</div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-neutral-100">
                                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600">Py</div>
                                            <div>
                                                <p className="text-sm font-medium text-black">Python</p>
                                                <p className="text-xs text-neutral-400">4 years • Expert</p>
                                            </div>
                                            <div className="ml-auto text-xs text-emerald-600 font-medium">✓ Verified</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </section>

            {/* ===== 4x2 FEATURE GRID ===== */}
            <section className="py-20 bg-neutral-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 rounded-2xl overflow-hidden border border-neutral-200">
                        {[
                            { icon: <Layers className="w-5 h-5" />, title: "Built for scale", desc: "Built for enterprises, startups, dreamers, thinkers and doers." },
                            { icon: <Zap className="w-5 h-5" />, title: "Ease of use", desc: "It's as easy as uploading a resume — and just as powerful." },
                            { icon: <DollarSign className="w-5 h-5" />, title: "Free to start", desc: "No cap, no lock, no credit card required. Start matching today." },
                            { icon: <Cloud className="w-5 h-5" />, title: "100% Uptime", desc: "We just cannot be taken down. Your hiring never stops." },
                            { icon: <Shield className="w-5 h-5" />, title: "Secure & Private", desc: "Your data is encrypted end-to-end. Privacy is our promise." },
                            { icon: <HelpCircle className="w-5 h-5" />, title: "24/7 Support", desc: "Round-the-clock assistance from our dedicated support team." },
                            { icon: <Clock className="w-5 h-5" />, title: "Instant matching", desc: "Get matched with the right roles in seconds, not days." },
                            { icon: <Heart className="w-5 h-5" />, title: "Made with love", desc: "Crafted by a passionate team focused on your career success." },
                        ].map((item, i) => (
                            <BlurFade key={i} delay={0.05 * i}>
                                <div className="bg-white p-6 md:p-8 flex flex-col">
                                    <div className="text-neutral-700 mb-4">{item.icon}</div>
                                    <h3 className="text-sm font-bold text-black mb-2">{item.title}</h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== STATS STRIP ===== */}
            <section className="py-16 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                                <NumberTicker value={10000} className="text-black" />+
                            </div>
                            <div className="text-sm text-neutral-500 font-medium mt-1">Active Jobs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                                <NumberTicker value={50000} className="text-black" />+
                            </div>
                            <div className="text-sm text-neutral-500 font-medium mt-1">Candidates</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                                <NumberTicker value={95} className="text-black" />%
                            </div>
                            <div className="text-sm text-neutral-500 font-medium mt-1">Match Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                                <NumberTicker value={2000} className="text-black" />+
                            </div>
                            <div className="text-sm text-neutral-500 font-medium mt-1">Companies</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS MASONRY ===== */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <BlurFade delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-3 tracking-tight">
                            Loved by people all over the universe
                        </h2>
                        <p className="text-center text-neutral-500 text-sm mb-14 max-w-xl mx-auto">
                            SkillMatch AI is used by thousands of professionals around the globe. Our platform has fan bases and people recommend us everywhere.
                        </p>
                    </BlurFade>

                    {/* 3-column Marquee testimonials */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((colIdx) => (
                            <Marquee key={colIdx} vertical pauseOnHover className="[--duration:25s] h-[500px]" reverse={colIdx === 1}>
                                {testimonials
                                    .filter((_, i) => i % 3 === colIdx)
                                    .map((t, i) => (
                                        <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5 mb-4 hover:shadow-sm transition-shadow">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                    {t.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-black">{t.name}</p>
                                                    <p className="text-xs text-neutral-400">{t.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-neutral-600 leading-relaxed">{t.text}</p>
                                        </div>
                                    ))
                                }
                            </Marquee>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-100">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <BlurFade delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
                            Ready to find your perfect match?
                        </h2>
                        <p className="text-neutral-500 text-sm mb-8 max-w-md mx-auto">
                            Join thousands of professionals and companies already using AI to connect smarter.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/auth/signup">
                                <Button size="lg" className="bg-black hover:bg-neutral-800 text-white rounded-lg px-8 h-11 text-sm font-medium">
                                    Get started for free
                                </Button>
                            </Link>
                            <Link href="/jobs" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                                Browse Jobs →
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </section>
        </div>
    );
}
