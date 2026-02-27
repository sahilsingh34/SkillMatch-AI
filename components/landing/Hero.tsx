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
                    <Link href="/auth/signup?role=SEEKER" className="w-full sm:w-auto">
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
                    {/* Simulated Company Logos - In reality, use actual SVG/PNG logos */}
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-slate-300 rounded-sm"></div>
                        <span className="font-bold text-slate-400 text-lg tracking-tight">kmarket</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-0 w-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-slate-400 border-r-[12px] border-r-transparent"></div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">TBC BANK</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-6 w-6 rounded-full border-2 border-slate-400"></div>
                        <span className="font-bold text-slate-600 text-lg">alif</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-black text-slate-400 text-2xl tracking-tighter">U</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-6 w-6 rounded-full bg-slate-300"></div>
                        <span className="font-bold text-slate-700 text-xl tracking-tight">uzum</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-slate-800 rounded-bl-xl rounded-tr-xl"></div>
                        <span className="font-bold text-slate-800 text-lg">mahalla</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-slate-700 rotate-45"></div>
                        <span className="font-bold text-slate-900 text-xl tracking-tight">Chakana</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-slate-300 text-2xl tracking-tight">Pay</span>
                    </div>
                </div>
            </div>

            {/* Subtle light leak effects to keep it from being completely flat, but very minimal */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50/80 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/2 translate-y-1/3"></div>
        </section>
    );
}
