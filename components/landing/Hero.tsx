import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { WordRotate } from "@/components/ui/word-rotate";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";

export function Hero({ userRole }: { userRole?: string | null }) {

    // --- SEEKER Layout ---
    if (userRole === "SEEKER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-slate-50 overflow-hidden selection:bg-blue-200">
                <div className="text-center max-w-4xl px-4 z-10">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                            Welcome back to SkillMatch
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111827] leading-[1.1] mb-6">
                            Find your next{" "}
                            <WordRotate
                                words={["dream role", "perfect job", "next career", "ideal match"]}
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                            />
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="text-lg md:text-xl text-slate-600 font-medium tracking-tight mb-10 max-w-2xl mx-auto">
                            We've analyzed your skills. Discover the top companies that are hiring specifically for your expertise right now.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                            <Link href="/jobs" className="w-full sm:w-auto">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-14 text-base font-bold shadow-xl shadow-blue-500/20 transition-transform hover:-translate-y-0.5 w-full">
                                    View Your AI Matches
                                </Button>
                            </Link>
                            <Link href="/dashboard/profile/applications" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="bg-white border-slate-200 hover:bg-slate-100 text-slate-900 rounded-xl px-10 h-14 text-base font-bold shadow-sm transition-transform hover:-translate-y-0.5 w-full">
                                    Track My Applications
                                </Button>
                            </Link>
                        </div>
                    </BlurFade>
                </div>
                <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-10 right-20 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            </section>
        );
    }

    // --- RECRUITER Layout ---
    if (userRole === "RECRUITER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-[#0a0f1c] overflow-hidden selection:bg-emerald-900">
                <div className="text-center max-w-4xl px-4 z-10">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 rounded-full">
                            Employer Dashboard
                        </div>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                            Hire the top <span className="text-emerald-400">1% of talent</span>
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="text-lg md:text-xl text-slate-400 font-medium tracking-tight mb-10 max-w-2xl mx-auto">
                            Stop wasting time screening resumes. Let our AI instantly match your job requirements with pre-verified candidates.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                            <Link href="/dashboard/recruiter/post-job" className="w-full sm:w-auto">
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-10 h-14 text-base font-bold shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 w-full">
                                    Post a Job Instantly
                                </Button>
                            </Link>
                            <Link href="/dashboard/recruiter" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-800 text-white rounded-xl px-10 h-14 text-base font-bold shadow-sm transition-transform hover:-translate-y-0.5 w-full">
                                    Manage Pipelines
                                </Button>
                            </Link>
                        </div>
                    </BlurFade>
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-1/2 translate-y-1/3"></div>
            </section>
        );
    }

    // --- DEFAULT (Logged Out / Premium Marketing) Layout - LIGHT THEME ---
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-24 bg-white overflow-hidden selection:bg-violet-100">

            {/* Soft gradient background orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-violet-100/70 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/70 rounded-full blur-[150px] pointer-events-none animate-pulse [animation-delay:1s]"></div>
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-cyan-100/50 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:2s]"></div>

            <div className="relative z-10 text-center max-w-5xl px-4">

                {/* Top badge with Animated Shiny Text */}
                <BlurFade delay={0.1}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold bg-violet-50 border border-violet-200 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <AnimatedShinyText shimmerWidth={200} className="text-violet-700">
                            AI-Powered Talent Platform
                        </AnimatedShinyText>
                    </div>
                </BlurFade>

                {/* Main headline with gradient */}
                <BlurFade delay={0.2}>
                    <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-extrabold tracking-[-0.04em] leading-[1.05] mb-8">
                        <span className="text-slate-900">Where </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500">talent</span>
                        <br className="hidden sm:block" />
                        <span className="text-slate-900"> meets </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600">opportunity</span>
                    </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <p className="text-lg md:text-xl text-slate-500 font-medium tracking-tight mb-12 max-w-2xl mx-auto leading-relaxed">
                        The next-gen platform that uses AI to match the right people to the right roles. Whether you&apos;re hiring or job-hunting, we make it effortless.
                    </p>
                </BlurFade>

                {/* CTA Buttons */}
                <BlurFade delay={0.4}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0 mb-16">
                        <Link href="/auth/signup?role=SEEKER" className="w-full sm:w-auto">
                            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl px-10 h-14 text-base font-bold shadow-xl shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:shadow-violet-500/30 w-full border-0">
                                Find Your Dream Job
                            </Button>
                        </Link>
                        <Link href="/auth/signup?role=RECRUITER" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl px-10 h-14 text-base font-bold shadow-sm transition-all hover:-translate-y-0.5 w-full">
                                I&apos;m Hiring
                            </Button>
                        </Link>
                    </div>
                </BlurFade>

                {/* Stats row with Number Tickers */}
                <BlurFade delay={0.5}>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 border-t border-slate-200/60">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                <NumberTicker value={10000} className="text-slate-900" />+
                            </div>
                            <div className="text-sm text-slate-400 font-medium mt-1">Active Jobs</div>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                <NumberTicker value={50000} className="text-slate-900" />+
                            </div>
                            <div className="text-sm text-slate-400 font-medium mt-1">Candidates</div>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                <NumberTicker value={95} className="text-slate-900" />%
                            </div>
                            <div className="text-sm text-slate-400 font-medium mt-1">Match Accuracy</div>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                <NumberTicker value={2000} className="text-slate-900" />+
                            </div>
                            <div className="text-sm text-slate-400 font-medium mt-1">Companies</div>
                        </div>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}
