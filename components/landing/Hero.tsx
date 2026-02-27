import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero({ userRole }: { userRole?: string | null }) {

    // --- SEEKER Layout ---
    if (userRole === "SEEKER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-slate-50 overflow-hidden selection:bg-blue-200">
                <div className="text-center max-w-4xl px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                        Welcome back to SkillMatch
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111827] leading-[1.1] mb-6 shadow-sm">
                        Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">dream role</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium tracking-tight mb-10 max-w-2xl mx-auto">
                        We've analyzed your skills. Discover the top companies that are hiring specifically for your expertise right now.
                    </p>
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
                </div>

                {/* Subtle seeker background decoration */}
                <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-10 right-20 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            </section>
        );
    }

    // --- RECRUITER Layout ---
    if (userRole === "RECRUITER") {
        return (
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 bg-[#0a0f1c] overflow-hidden selection:bg-emerald-900">
                <div className="text-center max-w-4xl px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 rounded-full">
                        Employer Dashboard
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                        Hire the top <span className="text-emerald-400">1% of talent</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 font-medium tracking-tight mb-10 max-w-2xl mx-auto">
                        Stop wasting time screening resumes. Let our AI instantly match your job requirements with pre-verified candidates.
                    </p>
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
                </div>

                {/* Cyber/Recruiter background decoration */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-1/2 translate-y-1/3"></div>
            </section>
        );
    }

    // --- DEFAULT (Logged Out / Marketing) Layout ---
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 bg-white overflow-hidden selection:bg-slate-200">
            <div className="text-center max-w-4xl px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-6xl md:text-[5.5rem] font-bold tracking-[-0.03em] text-[#111827] leading-[1.1] mb-6">
                    Good jobs &ndash; <br className="hidden md:block" />
                    Great talent in one place
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium tracking-tight mb-12 max-w-2xl mx-auto">
                    The platform connecting top developers and companies
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                    <Link href="/auth/signup?role=RECRUITER" className="w-full sm:w-auto">
                        <Button size="lg" className="bg-[#111827] hover:bg-black text-white rounded-xl px-10 h-14 text-base font-bold shadow-xl shadow-black/10 transition-transform hover:-translate-y-0.5 w-full">
                            Post a Job
                        </Button>
                    </Link>
                    <Link href="/jobs" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl px-10 h-14 text-base font-bold shadow-sm transition-transform hover:-translate-y-0.5 w-full">
                            Find a Job
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Trusted Companies Strip */}
            <div className="mt-32 w-full max-w-6xl mx-auto px-6 z-10 animate-in fade-in duration-1000 delay-500 fill-mode-both">
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                        <span className="font-bold text-slate-700 text-lg tracking-tight">Google</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-[2px] w-5 h-5">
                            <div className="bg-[#f25022]"></div><div className="bg-[#7fba00]"></div>
                            <div className="bg-[#00a4ef]"></div><div className="bg-[#ffb900]"></div>
                        </div>
                        <span className="font-bold text-slate-700 text-lg tracking-tight">Microsoft</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 border-2 border-[#111827] flex items-center justify-center font-bold text-xs">tcs</div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">TCS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-slate-800 relative overflow-hidden"><div className="absolute top-1 left-2 w-3 h-3 bg-white rounded-full"></div></div>
                        <span className="font-bold text-slate-800 text-lg">Apple</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-black text-slate-700 text-2xl tracking-tighter">a</span>
                        <span className="font-bold text-slate-700 text-lg">amazon</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-6 border-4 border-blue-600 rounded-full"></div>
                        <span className="font-bold text-slate-800 text-lg">Meta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600 text-2xl tracking-tighter">N</span>
                        <span className="font-bold text-slate-800 text-lg">NETFLIX</span>
                    </div>
                </div>
            </div>

            {/* Subtle light leak effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50/80 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/2 translate-y-1/3"></div>
        </section>
    );
}
