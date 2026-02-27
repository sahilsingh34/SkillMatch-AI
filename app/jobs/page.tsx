import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, DollarSign, Clock, Search, Sparkles, ChevronLeft, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";
import { SaveJobButton } from './SaveJobButton';
import Image from 'next/image';
import { BlurFade } from "@/components/ui/blur-fade";
import { RetroGrid } from "@/components/ui/retro-grid";

// Helper for Mock Vector Matching
function calculateMatchScore(jobSkills: string, userSkills: string[]): number {
    if (!userSkills || userSkills.length === 0) return 30; // Base score for effort

    const formattedJobSkills = jobSkills.split(',').map((s: string) => s.trim().toLowerCase());
    const formattedUserSkills = userSkills.map((s: string) => s.toLowerCase());

    const matches = formattedJobSkills.filter((skill: string) =>
        formattedUserSkills.some((us: string) => us.includes(skill) || skill.includes(us))
    );
    const score = Math.round((matches.length / formattedJobSkills.length) * 100);

    return Math.max(10, score);
}

export default async function JobsPage({
    searchParams
}: {
    searchParams: Promise<{
        skills?: string,
        page?: string,
        sort?: string,
        search?: string,
        location?: string,
        type?: string
    }>
}) {
    const params = await searchParams;
    const userSkillsParam = params.skills;
    const page = parseInt(params.page || "1");
    const sort = params.sort || "newest";
    const search = params.search || "";
    const locationFilter = params.location || "";
    const typeFilter = params.type || "";
    const limit = 6;
    const skip = (page - 1) * limit;

    let userSkills: string[] = userSkillsParam ? userSkillsParam.split(',') : [];

    const { userId } = await auth();
    let savedJobIds: Set<string> = new Set();
    let isSeeker = false;

    if (userId) {
        try {
            // @ts-ignore
            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
                include: {
                    profile: true,
                    savedJobs: { select: { jobId: true } }
                } as any
            }) as any;

            if (user?.role === "SEEKER") isSeeker = true;

            if (user?.profile?.skills && userSkills.length === 0) {
                userSkills = user.profile.skills.split(',').map((s: string) => s.trim());
            }
            if (user?.savedJobs) {
                user?.savedJobs.forEach((sj: any) => savedJobIds.add(sj.jobId));
            }
        } catch (e) {
            console.error("Jobs: failed to fetch user metadata", e);
        }
    }

    // Build Prisma query
    const where: any = {};
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { skills: { contains: search, mode: 'insensitive' } }
        ];
    }
    if (locationFilter) {
        where.location = { contains: locationFilter, mode: 'insensitive' };
    }
    if (typeFilter) {
        where.type = typeFilter;
    }

    let orderBy: any = { postedAt: 'desc' };
    if (sort === 'salary_desc') orderBy = { salary: 'desc' };

    // Fetch jobs with pagination
    let dbJobs: any[] = [];
    let totalJobs = 0;
    try {
        [dbJobs, totalJobs] = await Promise.all([
            prisma.job.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.job.count({ where })
        ]);
    } catch (e) {
        console.error("Jobs: failed to fetch jobs from DB", e);
    }

    const totalPages = Math.ceil(totalJobs / limit);

    // Score jobs dynamically
    const displayJobs = dbJobs.map((job: any) => {
        return {
            ...job,
            isSaved: savedJobIds.has(job.id),
            matchScore: userSkills.length > 0 ? calculateMatchScore(job.skills, userSkills) : 40
        };
    });

    if (sort === 'match') {
        displayJobs.sort((a, b) => b.matchScore - a.matchScore);
    }

    // Quick horizontal filters (Skills)
    const hotSkills = ["React", "Node.js", "Python", "AWS", "UX Designer", "Product Manager", "Remote", "Senior Level"];

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">

            {/* HERO HEADER - Clean White Section */}
            <section className="relative bg-white dark:bg-neutral-950 pt-36 pb-32 px-6 overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
                <RetroGrid className="opacity-40" />
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <BlurFade delay={0.1}>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white mb-6">
                            Find your <span className="text-blue-600 italic">dream job</span>
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium max-w-2xl mx-auto mb-12">
                            Discover highly-matched roles at top tech companies. Let AI connect you with opportunities perfectly aligned with your verified skills.
                        </p>
                    </BlurFade>
                </div>
            </section>

            {/* FLOATING PILL SEARCH BAR */}
            <div className="container mx-auto max-w-6xl px-4 relative z-20 -mt-16 md:-mt-10 mb-12 lg:mb-16">
                <BlurFade delay={0.3}>
                    <form className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 border border-neutral-200 dark:border-neutral-700 transition-all focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500">
                        <div className="flex-1 flex items-center px-4 py-3 md:py-0 w-full border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800">
                            <Search className="h-5 w-5 text-neutral-400 shrink-0 mr-3" />
                            <Input
                                name="search"
                                defaultValue={search}
                                placeholder="Job title, keywords, or company"
                                className="bg-transparent border-none focus-visible:ring-0 text-base shadow-none px-0 h-10 w-full placeholder:text-neutral-400 text-black dark:text-white font-medium"
                            />
                        </div>

                        <div className="flex-1 flex items-center px-4 py-3 md:py-0 w-full">
                            <MapPin className="h-5 w-5 text-neutral-400 shrink-0 mr-3" />
                            <Input
                                name="location"
                                defaultValue={locationFilter}
                                placeholder="Add country or city"
                                className="bg-transparent border-none focus-visible:ring-0 text-base shadow-none px-0 h-10 w-full placeholder:text-neutral-400 text-black dark:text-white font-medium"
                            />
                        </div>

                        <Button type="submit" size="lg" className="w-full md:w-auto bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-full px-10 h-14 mt-2 md:mt-0 text-base font-bold shadow-lg shadow-black/10 shrink-0 transition-transform active:scale-95">
                            Search
                        </Button>
                    </form>
                </BlurFade>
            </div>

            {/* MAIN 3-COLUMN LAYOUT */}
            <div className="container mx-auto px-4 max-w-7xl pb-24">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* LEFT COLUMN: FILTERS */}
                    <div className="w-full lg:w-[240px] xl:w-64 shrink-0 space-y-10 lg:sticky lg:top-28 h-fit order-2 lg:order-1">

                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-black dark:text-white">Filters</h2>
                            {(typeFilter || locationFilter || search) && (
                                <Link href="/jobs" className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">Clear all</Link>
                            )}
                        </div>

                        {/* Job Type Filter */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Employment Type</h3>
                                {typeFilter && <Link href={`/jobs?search=${search}&location=${locationFilter}`} className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 font-medium">Clear</Link>}
                            </div>
                            <div className="flex flex-col gap-3">
                                {["Full-time", "Contract", "Remote", "Freelance", "Internship"].map((type) => {
                                    const isActive = typeFilter === type;
                                    return (
                                        <Link key={type} href={`/jobs?type=${type}&sort=${sort}&search=${search}&location=${locationFilter}`}>
                                            <div className="flex items-center group cursor-pointer">
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${isActive ? 'bg-[#111827] dark:bg-white border-[#111827] dark:border-white' : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-500'}`}>
                                                    {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-white dark:text-black" />}
                                                </div>
                                                <span className={`ml-3 text-sm font-medium transition-colors ${isActive ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'}`}>
                                                    {type}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Salary Type (Mock) */}
                        <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-8">
                            <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Salary Range</h3>
                            <div className="flex flex-col gap-3">
                                {["Under $50k", "$50k - $100k", "$100k - $150k", "Over $150k"].map((range) => (
                                    <div key={range} className="flex items-center group cursor-not-allowed opacity-50">
                                        <div className="w-5 h-5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50"></div>
                                        <span className="ml-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">{range}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CENTER COLUMN: JOB FEED */}
                    <div className="flex-1 min-w-0 order-1 lg:order-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-semibold text-neutral-500 dark:text-neutral-400">
                                Showing <span className="text-black dark:text-white font-bold">{totalJobs}</span> results found
                            </h2>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-neutral-500 dark:text-neutral-400">Sort By:</span>
                                <select
                                    className="bg-transparent font-semibold text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md px-2 py-1 focus:outline-none cursor-pointer border-none transition-colors"
                                    defaultValue={sort}
                                // Normally handled by client-side router, but using poor-man's form approach for SSR simplicity without client wrapper
                                >
                                    <option value="newest">Date Posted</option>
                                    <option value="match">AI Match Score</option>
                                    <option value="salary_desc">Highest Salary</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {displayJobs.map((job) => (
                                <div key={job.id} className="group rounded-[1.5rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer relative">
                                    <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">

                                        {/* Company Logo Square */}
                                        <div className="w-16 h-16 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center shrink-0 shadow-sm overflow-hidden relative">
                                            {/* Placeholder for real logos, using initial for now */}
                                            <span className="text-2xl font-black text-neutral-300 dark:text-neutral-600 uppercase">{job.company.charAt(0)}</span>
                                            {job.matchScore >= 80 && (
                                                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg"></div>
                                            )}
                                        </div>

                                        {/* Core Job Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                                <div>
                                                    <Link href={`/jobs/${job.id}`}>
                                                        <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                            {job.title}
                                                        </h3>
                                                    </Link>
                                                    <div className="flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                                                        <span>{job.company}</span>
                                                        <span className="mx-2 text-neutral-300 dark:text-neutral-600">•</span>
                                                        <span>{job.location}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center shrink-0 space-x-4">
                                                    {/* AI Match Score Pill */}
                                                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${job.matchScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'}`}>
                                                        <Sparkles className="h-3 w-3" />
                                                        {job.matchScore}% Match
                                                    </div>
                                                    {/* Save Button */}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <SaveJobButton jobId={job.id} initialSaved={job.isSaved} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Structured Meta Data Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 mb-1">Experience</div>
                                                    <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">1 to 3 Years</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 mb-1">Job Type</div>
                                                    <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{job.type}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 mb-1">Salary</div>
                                                    <div className="text-sm font-semibold text-black dark:text-white">{job.salary}</div>
                                                </div>
                                                <div className="flex items-end justify-end">
                                                    <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
                                                        Posted {job.postedAt.toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {displayJobs.length === 0 && (
                                <div className="text-center py-24 px-6 border border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50">
                                    <Search className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No jobs found</h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto font-medium">Try adjusting your keyword, location, or clearing the filters to find what you're looking for.</p>
                                    <Link href="/jobs">
                                        <Button className="mt-8 bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-full px-8 shadow-md h-12">
                                            Clear Filters
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <Link href={`/jobs?page=${Math.max(1, page - 1)}&sort=${sort}&search=${search}&type=${typeFilter}&location=${locationFilter}`}>
                                    <Button variant="outline" size="icon" disabled={page === 1} className="rounded-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <Link key={i} href={`/jobs?page=${i + 1}&sort=${sort}&search=${search}&type=${typeFilter}&location=${locationFilter}`}>
                                        <Button
                                            variant={page === i + 1 ? "default" : "outline"}
                                            className={`h-10 w-10 p-0 rounded-full font-bold transition-all ${page === i + 1 ? 'bg-[#111827] dark:bg-white hover:bg-black dark:hover:bg-neutral-200 text-white dark:text-black shadow-md' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                                        >
                                            {i + 1}
                                        </Button>
                                    </Link>
                                ))}
                                <Link href={`/jobs?page=${Math.min(totalPages, page + 1)}&sort=${sort}&search=${search}&type=${typeFilter}&location=${locationFilter}`}>
                                    <Button variant="outline" size="icon" disabled={page === totalPages} className="rounded-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: WIDGETS */}
                    <div className="hidden lg:block lg:w-[280px] xl:w-[320px] shrink-0 space-y-8 order-3">
                        {/* Promo Block: Match / Upload */}
                        <div className="bg-[#111827] dark:bg-neutral-900 rounded-[28px] p-8 text-white relative overflow-hidden shadow-2xl shadow-black/10">
                            {/* Minimal geometric accents */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-8 -mb-8 blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 dark:bg-neutral-800/80 rounded-2xl flex items-center justify-center mb-6 border border-white/10 dark:border-neutral-700 backdrop-blur-sm shadow-inner">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">Upload your resume</h3>
                                <p className="text-neutral-300 dark:text-neutral-400 text-sm leading-relaxed mb-6 font-medium">
                                    We'll extract your skills and instantly match you with the right jobs. Right job, right away!
                                </p>

                                {isSeeker ? (
                                    <Link href="/dashboard/profile">
                                        <Button className="w-full bg-white dark:bg-blue-600 text-[#111827] dark:text-white hover:bg-neutral-100 dark:hover:bg-blue-700 font-bold rounded-xl h-12 shadow-sm transition-colors">
                                            Update Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/auth/signup">
                                        <Button className="w-full bg-white dark:bg-blue-600 text-[#111827] dark:text-white hover:bg-neutral-100 dark:hover:bg-blue-700 font-bold rounded-xl h-12 shadow-sm transition-colors">
                                            Sign up to match
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Popular Locations Widget */}
                        <div className="bg-white dark:bg-neutral-900 rounded-[28px] p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                            <h3 className="text-base font-bold text-black dark:text-white mb-6 tracking-tight">Popular Locations</h3>
                            <div className="space-y-4 relative z-10">
                                {["San Francisco, CA", "New York, NY", "London, UK", "Remote", "Austin, TX"].map((loc) => (
                                    <Link key={loc} href={`/jobs?location=${loc}`} className="flex items-center justify-between group">
                                        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {loc}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-neutral-300 dark:text-neutral-600 group-hover:border-blue-200 dark:group-hover:border-neutral-700 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-neutral-50 dark:bg-neutral-800/50 rounded-full border border-neutral-100/50 dark:border-neutral-800/50 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
