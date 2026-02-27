import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function Footer() {
    let userRole: string | null = null;

    try {
        const { userId } = await auth();
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
                select: { role: true },
            });
            userRole = user?.role ?? null;
        }
    } catch (e) {
        // Silently fail for footer
    }

    return (
        <footer className="border-t border-slate-200/60 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
            <div className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Brand Column */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
                            <div className="h-8 px-3 bg-[#0f172a] rounded-full flex items-center justify-center">
                                <span className="text-white font-mono font-bold text-sm">{"</>"}</span>
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">SkillMatch</span>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed max-w-sm mt-2">
                            AI-powered talent matching that connects the right people with the right opportunities. Built for the modern workforce.
                        </p>
                    </div>

                    {/* Dynamic Links based on Role */}
                    {userRole === "SEEKER" ? (
                        <>
                            <div className="md:col-span-3">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4">Discover</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/jobs" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Browse Jobs</Link></li>
                                    <li><Link href="/dashboard/profile/applications" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">My Applications</Link></li>
                                    <li><Link href="/dashboard/profile" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">My Profile</Link></li>
                                </ul>
                            </div>
                            <div className="md:col-span-4">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4">Resources</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/dashboard/profile" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Resume Builder</Link></li>
                                    <li><Link href="/jobs" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">AI Skill Matching</Link></li>
                                </ul>
                            </div>
                        </>
                    ) : userRole === "RECRUITER" ? (
                        <>
                            <div className="md:col-span-3">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4">Recruiting</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/dashboard/recruiter/post-job" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Post a Job</Link></li>
                                    <li><Link href="/dashboard/recruiter" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">My Job Listings</Link></li>
                                    <li><Link href="/dashboard/recruiter" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Applicant Pipeline</Link></li>
                                </ul>
                            </div>
                            <div className="md:col-span-4">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4">Employer Tools</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/dashboard/recruiter" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link></li>
                                    <li><Link href="/dashboard/recruiter/post-job" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">AI Candidate Matching</Link></li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="md:col-span-3">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4">For Candidates</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/jobs" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Browse Jobs</Link></li>
                                    <li><Link href="/auth/signup?role=SEEKER" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Create Profile</Link></li>
                                    <li><Link href="/auth/signup?role=SEEKER" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">AI Matching</Link></li>
                                </ul>
                            </div>
                            <div className="md:col-span-4">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4">For Employers</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/auth/signup?role=RECRUITER" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Post a Job</Link></li>
                                    <li><Link href="/auth/signup?role=RECRUITER" className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">Find Talent</Link></li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200/60 dark:border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} SkillMatch AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-400">
                        <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-neutral-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-600 dark:hover:text-neutral-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
