import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 bg-white overflow-hidden selection:bg-slate-200">
            {/* Top Text / Category Label */}
            <div
                className="mb-6 flex flex-col items-center"
            >
                {/* Simulated minimal logo mark above title (optional, based on layout flow) */}
            </div>

            {/* Main Headline */}
            <div
                className="text-center max-w-4xl px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            >
                <h1 className="text-6xl md:text-[5.5rem] font-bold tracking-[-0.03em] text-[#111827] leading-[1.1] mb-6">
                    Good jobs &ndash; <br className="hidden md:block" />
                    Great talent in one place
                </h1>

                <p className="text-lg md:text-xl text-slate-500 font-medium tracking-tight mb-12 max-w-2xl mx-auto">
                    The platform connecting top developers and companies
                </p>

                {/* Call to Action Buttons */}
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
            <div
                className="mt-32 w-full max-w-6xl mx-auto px-6 z-10 animate-in fade-in duration-1000 delay-500 fill-mode-both"
            >
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

            {/* Subtle light leak effects to keep it from being completely flat, but very minimal */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50/80 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/2 translate-y-1/3"></div>
        </section>
    );
}
