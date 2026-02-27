import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WordRotate } from "@/components/ui/word-rotate";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight } from "lucide-react";

export function Hero({ userRole }: { userRole?: string | null }) {

    // --- SEEKER Layout ---
    if (userRole === "SEEKER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-white overflow-hidden">
                <div className="text-center max-w-4xl px-4 z-10">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                            Welcome back to SkillMatch
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[1.1] mb-6">
                            Find your next{" "}
                            <WordRotate
                                words={["dream role", "perfect job", "next career", "ideal match"]}
                                className="inline-block text-black"
                            />
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="text-base md:text-lg text-neutral-500 font-normal mb-10 max-w-lg mx-auto leading-relaxed">
                            We've analyzed your skills. Discover the top companies that are hiring specifically for your expertise right now.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.4}>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/jobs">
                                <Button size="lg" className="bg-black hover:bg-neutral-800 text-white rounded-lg px-6 h-11 text-sm font-medium">
                                    View AI Matches
                                </Button>
                            </Link>
                            <Link href="/dashboard/profile/applications" className="text-sm font-medium text-neutral-600 hover:text-black flex items-center gap-1 transition-colors">
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
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-white overflow-hidden">
                <div className="text-center max-w-4xl px-4 z-10">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                            Employer Dashboard
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[1.1] mb-6">
                            Hire the top{" "}
                            <span className="text-black">1% of talent</span>
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="text-base md:text-lg text-neutral-500 font-normal mb-10 max-w-lg mx-auto leading-relaxed">
                            Stop wasting time screening resumes. Let our AI instantly match your job requirements with pre-verified candidates.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.4}>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/dashboard/recruiter/post-job">
                                <Button size="lg" className="bg-black hover:bg-neutral-800 text-white rounded-lg px-6 h-11 text-sm font-medium">
                                    Post a Job
                                </Button>
                            </Link>
                            <Link href="/dashboard/recruiter" className="text-sm font-medium text-neutral-600 hover:text-black flex items-center gap-1 transition-colors">
                                Manage Pipelines <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </section>
        );
    }

    // --- DEFAULT (Guest) Layout - Every AI Style ---
    return (
        <section className="relative flex flex-col items-center justify-center pt-36 pb-24 bg-white overflow-hidden">
            <div className="relative z-10 text-center max-w-4xl px-4">

                {/* Pill badge */}
                <BlurFade delay={0.1}>
                    <Link href="/auth/signup" className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-8 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors border border-neutral-200">
                        <AnimatedShinyText shimmerWidth={200}>
                            AI-Powered Talent Matching
                        </AnimatedShinyText>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                    </Link>
                </BlurFade>

                {/* Main headline - massive bold */}
                <BlurFade delay={0.2}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tight leading-[1.1] mb-6 text-black">
                        Find Jobs, Talent<br />
                        and Skills with AI
                    </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <p className="text-base md:text-lg text-neutral-500 font-normal mb-10 max-w-xl mx-auto leading-relaxed">
                        SkillMatch AI seamlessly connects job seekers with recruiters using intelligent skill-based matching, so you find the perfect fit effortlessly.
                    </p>
                </BlurFade>

                {/* CTAs */}
                <BlurFade delay={0.4}>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-black hover:bg-neutral-800 text-white rounded-lg px-6 h-11 text-sm font-medium">
                                Get started
                            </Button>
                        </Link>
                        <Link href="/jobs" className="text-sm font-medium text-neutral-600 hover:text-black flex items-center gap-1 transition-colors">
                            Browse Jobs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}
