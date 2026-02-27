import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Building, ChevronRight, Clock, DollarSign, Globe2, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ApplyNowButton } from "./ApplyNowButton";
import { Particles } from "@/components/ui/particles";

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
        <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 transition-colors">
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl pt-12">
                <Link href="/jobs" className="inline-flex items-center text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-12">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Search
                </Link>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-12">
                        {/* Job Header Info */}
                        <div>
                            <div className="flex flex-col gap-4 mb-8">
                                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1] text-black dark:text-white">{job.title}</h1>
                                <div className="flex items-center text-[17px] font-medium text-neutral-500 dark:text-neutral-400">
                                    <Building className="mr-2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                                    {job.company}
                                </div>
                            </div>

                            {/* Job Meta Flow */}
                            <div className="flex flex-wrap gap-3 text-sm py-8 border-y border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center font-semibold bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 px-5 py-2.5 rounded-full text-black dark:text-neutral-300">
                                    <MapPin className="mr-2 h-4 w-4 text-neutral-400 dark:text-neutral-500" /> {job.location}
                                </div>
                                <div className="flex items-center font-semibold bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 px-5 py-2.5 rounded-full text-black dark:text-neutral-300">
                                    <Briefcase className="mr-2 h-4 w-4 text-neutral-400 dark:text-neutral-500" /> {job.type}
                                </div>
                                <div className="flex items-center font-bold bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 px-5 py-2.5 rounded-full text-emerald-700 dark:text-emerald-400">
                                    <DollarSign className="mr-1 h-4 w-4 text-emerald-600 dark:text-emerald-500" /> {job.salary}
                                </div>
                            </div>
                        </div>

                        {/* Description Content */}
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">About the Role</h2>
                            <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-6 text-lg">
                                <p>
                                    We are looking for a passionate <strong>{job.title}</strong> to join our dynamic team at <strong>{job.company}</strong>. In this role, you will be responsible for building high-quality, scalable applications and working closely with cross-functional teams to deliver excellent user experiences.
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-black dark:text-white mt-10 mb-6">Key Responsibilities</h3>
                            <ul className="list-disc pl-5 space-y-3 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed marker:text-neutral-300 dark:marker:text-neutral-700">
                                <li>Design, develop, and maintain software features based on project requirements.</li>
                                <li>Collaborate with product managers, designers, and other engineers.</li>
                                <li>Participate in code reviews and ensure high standards of code quality.</li>
                                <li>Optimize applications for maximum speed and scalability.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-black dark:text-white mt-10 mb-6">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.split(',').map(skill => (
                                    <div key={skill.trim()} className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm">
                                        {skill.trim()}
                                    </div>
                                ))}
                                <div className="px-4 py-2 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                                    + Agile Methodologies
                                </div>
                                <div className="px-4 py-2 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                                    + Problem Solving
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-[380px] shrink-0 space-y-8 mt-8 lg:mt-0 relative z-10">

                        {/* Action Card */}
                        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow border border-neutral-200 dark:border-neutral-800">
                            <div className="flex flex-col gap-4 w-full">
                                <ApplyNowButton jobId={job.id} alreadyApplied={alreadyApplied} />
                                <Button variant="outline" className="w-full h-14 rounded-xl font-bold text-[15px] border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    Save Job
                                </Button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 space-y-5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-[10px]">Job ID</span>
                                    <span className="font-bold text-black dark:text-white">{job.id.slice(-5).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-[10px]">Applicants</span>
                                    <span className="font-bold text-black dark:text-white">2 Active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-[10px]">Posted</span>
                                    <div className="flex items-center font-bold text-black dark:text-white">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-neutral-400 dark:text-neutral-500" />
                                        {job.postedAt.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Card */}
                        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                                <div className="w-[72px] h-[72px] rounded-[1.25rem] border border-neutral-100 dark:border-neutral-800 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-center font-bold text-2xl text-blue-600 dark:text-blue-500 shrink-0">
                                    {job.company.charAt(0)}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-[22px] tracking-tight text-black dark:text-white">{job.company}</h3>
                                    <Link href="#" className="text-[15px] font-semibold text-blue-600 dark:text-blue-500 hover:underline decoration-2 underline-offset-4 group">
                                        View Profile <ChevronRight className="h-3.5 w-3.5 inline group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                            <p className="text-[15px] font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                                A leading technology company focused on delivering innovative solutions to complex industry problems.
                            </p>
                            <div className="flex items-center text-[15px] font-bold text-neutral-400 dark:text-neutral-500 group cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                                <Globe2 className="h-4 w-4 mr-2 group-hover:text-black dark:text-white transition-colors" />
                                {job.company.toLowerCase().replace(" ", "")}.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
