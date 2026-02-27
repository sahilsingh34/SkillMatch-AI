import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Building, ChevronRight, Clock, DollarSign, Globe2, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ApplyNowButton } from "./ApplyNowButton";

// Helper for Mock Vector Matching
function calculateMatchScore(jobSkills: string, userSkills: string[]): number {
    if (!userSkills || userSkills.length === 0) return 0;

    const formattedJobSkills = jobSkills.split(',').map(s => s.trim().toLowerCase());
    const formattedUserSkills = userSkills.map(s => s.toLowerCase());

    const matches = formattedJobSkills.filter((skill: string) => formattedUserSkills.includes(skill));
    const score = Math.round((matches.length / formattedJobSkills.length) * 100);

    return Math.max(40, score + (formattedJobSkills.length < 3 ? 20 : 0));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
        notFound();
    }

    const { userId: clerkId } = await auth();
    let alreadyApplied = false;
    let matchScore = 0;

    if (clerkId) {
        // @ts-ignore
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (user) {
            const existingApp = await prisma.applicant.findFirst({
                where: { jobId: job.id, userId: user.id }
            });
            alreadyApplied = !!existingApp;

            if (user.profile?.skills) {
                const userSkills = user.profile.skills.split(',').map((s: string) => s.trim());
                matchScore = calculateMatchScore(job.skills, userSkills);
            }
        }
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Minimal Header Accent */}
            <div className="h-40 bg-slate-50 border-b border-slate-100 flex items-end pb-8">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <Link href="/jobs" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Search
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 max-w-6xl -mt-4">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-10">
                        {/* Job Header Info */}
                        <div className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">{job.title}</h1>
                                    <div className="flex items-center text-lg font-medium text-slate-500">
                                        <Building className="mr-2 h-5 w-5 text-slate-400" />
                                        {job.company}
                                    </div>
                                </div>
                                {matchScore > 0 ? (
                                    <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold mt-2 md:mt-0 self-start ${matchScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                        <Sparkles className="h-4 w-4" />
                                        {matchScore}% AI Match
                                    </div>
                                ) : null}
                            </div>

                            {/* Job Meta Flow */}
                            <div className="flex flex-wrap gap-3 text-sm mt-8 border-t border-slate-100 pt-8">
                                <div className="flex items-center font-semibold bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-slate-700">
                                    <MapPin className="mr-2 h-4 w-4 text-slate-400" /> {job.location}
                                </div>
                                <div className="flex items-center font-semibold bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-slate-700">
                                    <Briefcase className="mr-2 h-4 w-4 text-slate-400" /> {job.type}
                                </div>
                                <div className="flex items-center font-semibold bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-emerald-800">
                                    <DollarSign className="mr-1.5 h-4 w-4 text-emerald-600" /> {job.salary}
                                </div>
                            </div>
                        </div>

                        {/* Description Content */}
                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Role</h2>
                            <div className="text-slate-600 leading-relaxed space-y-6 text-lg">
                                <p>
                                    We are looking for a passionate <strong>{job.title}</strong> to join our dynamic team at <strong>{job.company}</strong>. In this role, you will be responsible for building high-quality, scalable applications and working closely with cross-functional teams to deliver excellent user experiences.
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mt-10 mb-6">Key Responsibilities</h3>
                            <ul className="list-disc pl-5 space-y-3 text-slate-600 text-lg leading-relaxed marker:text-slate-300">
                                <li>Design, develop, and maintain software features based on project requirements.</li>
                                <li>Collaborate with product managers, designers, and other engineers.</li>
                                <li>Participate in code reviews and ensure high standards of code quality.</li>
                                <li>Optimize applications for maximum speed and scalability.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-10 mb-6">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.split(',').map(skill => (
                                    <div key={skill.trim()} className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm">
                                        {skill.trim()}
                                    </div>
                                ))}
                                <div className="px-4 py-2 rounded-full border border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-500">
                                    + Agile Methodologies
                                </div>
                                <div className="px-4 py-2 rounded-full border border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-500">
                                    + Problem Solving
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-[380px] shrink-0 space-y-8 mt-8 lg:-mt-24 relative z-10">

                        {/* Action Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                            <ApplyNowButton jobId={job.id} alreadyApplied={alreadyApplied} />
                            <Button variant="outline" className="w-full mt-4 h-14 rounded-xl font-bold text-base border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                Save Job
                            </Button>

                            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Job ID</span>
                                    <span className="font-bold text-slate-900 font-mono">{job.id.slice(-5).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Applicants</span>
                                    <span className="font-bold text-slate-900">2 Active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-400 uppercase tracking-widest text-[11px]">Posted</span>
                                    <div className="flex items-center font-bold text-slate-900">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                        {job.postedAt.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-2xl text-blue-600 border border-blue-100 shadow-inner">
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">{job.company}</h3>
                                    <Link href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center mt-1 group">
                                        View Profile <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                                A leading technology company focused on delivering innovative solutions to complex industry problems.
                            </p>
                            <div className="flex items-center text-sm font-semibold text-slate-400 group cursor-pointer hover:text-blue-600 transition-colors">
                                <Globe2 className="h-4 w-4 mr-2 group-hover:text-blue-600 transition-colors" />
                                {job.company.toLowerCase().replace(" ", "")}.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
