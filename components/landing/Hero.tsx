import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WordRotate } from "@/components/ui/word-rotate";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight } from "lucide-react";
import { Particles } from "@/components/ui/particles";

export function Hero({ userRole }: { userRole?: string | null }) {

    // --- SEEKER Layout ---
    if (userRole === "SEEKER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-white dark:bg-neutral-950 overflow-hidden">
                <div className="text-center max-w-4xl px-4 z-10">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-full border border-blue-100 dark:border-blue-800">
                            Welcome back to SkillMatch
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
                            Find your next{" "}
                            <WordRotate
                                words={["dream role", "perfect job", "next career", "ideal match"]}
                                className="inline-block text-black dark:text-white"
                            />
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-normal mb-10 max-w-lg mx-auto leading-relaxed">
                            We've analyzed your skills. Discover the top companies that are hiring specifically for your expertise right now.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.4}>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/jobs">
                                <Button size="lg" className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg px-6 h-11 text-sm font-medium">
                                    View AI Matches
                                </Button>
                            </Link>
                            <Link href="/dashboard/profile/applications" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
                                Track Applications <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </section>
        );
    }

    // --- RECRUITER Layout ---
    if (userRole === "RECRUITER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-white dark:bg-neutral-950 overflow-hidden">
                <div className="text-center max-w-4xl px-4 z-10">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-100 dark:border-emerald-800">
                            Employer Dashboard
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
                            Hire the top{" "}
                            <span className="text-black dark:text-white">1% of talent</span>
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-normal mb-10 max-w-lg mx-auto leading-relaxed">
                            Stop wasting time screening resumes. Let our AI instantly match your job requirements with pre-verified candidates.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.4}>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/dashboard/recruiter/post-job">
                                <Button size="lg" className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg px-6 h-11 text-sm font-medium">
                                    Post a Job
                                </Button>
                            </Link>
                            <Link href="/dashboard/recruiter" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
                                Manage Pipelines <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </section>
        );
    }

    // --- DEFAULT (Guest) Layout ---
    return (
        <section className="relative flex flex-col items-center justify-center pt-36 pb-24 bg-white dark:bg-neutral-950 overflow-hidden">
            <Particles className="absolute inset-0 z-0" quantity={60} ease={80} color="#a78bfa" size={0.5} staticity={50} />
            <div className="relative z-10 text-center max-w-4xl px-4">

                {/* Pill badge */}
                <BlurFade delay={0.1}>
                    <Link href="/auth/signup" className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-8 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors border border-neutral-200 dark:border-neutral-700">
                        <AnimatedShinyText shimmerWidth={200}>
                            AI-Powered Talent Matching
                        </AnimatedShinyText>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    </Link>
                </BlurFade>

                {/* Main headline */}
                <BlurFade delay={0.2}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tight leading-[1.1] mb-6 text-black dark:text-white">
                        Find Jobs, Talent<br />
                        and Skills with AI
                    </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-normal mb-10 max-w-xl mx-auto leading-relaxed">
                        SkillMatch AI seamlessly connects job seekers with recruiters using intelligent skill-based matching, so you find the perfect fit effortlessly.
                    </p>
                </BlurFade>

                {/* CTAs */}
                <BlurFade delay={0.4}>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg px-6 h-11 text-sm font-medium">
                                Get started
                            </Button>
                        </Link>
                        <Link href="/jobs" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
                            Browse Jobs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}
