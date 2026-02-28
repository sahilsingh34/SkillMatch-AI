import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Particles } from "@/components/ui/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Briefcase, MapPin, DollarSign, Building, Search, SlidersHorizontal, ChevronRight, ChevronLeft, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { getCachedJobs } from '@/lib/cache';
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

    // Fetch jobs with pagination (cached)
    const { jobs: dbJobs, total: totalJobs } = await getCachedJobs(where, orderBy, skip, limit);

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
        displayJobs.sort((a: any, b: any) => b.matchScore - a.matchScore);
    }

    // Quick horizontal filters (Skills)
    const hotSkills = ["React", "Node.js", "Python", "AWS", "UX Designer", "Product Manager", "Remote", "Senior Level"];

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">

            {/* HERO HEADER - Clean White Section */}
            <section className="relative flex flex-col items-center justify-center pt-36 pb-32 px-6 overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <Particles className="absolute inset-0 z-0" quantity={60} ease={80} color="#a78bfa" size={0.5} staticity={50} />
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <BlurFade delay={0.1}>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-black dark:text-white">
                            Find your dream job
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal max-w-2xl mx-auto mb-12 leading-relaxed">
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
                                                <div className={`w-[18px] h-[18px] rounded-[4px] border ${isActive ? 'bg-[#111827] dark:bg-white border-[#111827] dark:border-white' : 'bg-white dark:bg-transparent border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400'} flex items-center justify-center transition-colors`}>
                                                    {isActive && <CheckCircle2 className="h-3 w-3 text-white dark:text-black opacity-100" />}
                                                </div>
                                                <span className={`ml-3 text-[15px] font-medium transition-colors ${isActive ? 'text-black dark:text-white' : 'text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'}`}>
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
                                        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 transition-colors">{range}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Popular Locations Widget (Moved to Left) */}
                        <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-8">
                            <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Popular Locations</h3>
                            <div className="flex flex-col gap-3">
                                {["San Francisco, CA", "New York, NY", "London, UK", "Remote", "Austin, TX"].map((loc) => (
                                    <Link key={loc} href={`/jobs?location=${loc}`} className="flex items-center justify-between group">
                                        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                                            {loc}
                                        </span>
                                    </Link>
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
                            {displayJobs.map((job: any) => (
                                <div key={job.id} className="group rounded-[1.5rem] border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors cursor-pointer relative shadow-sm hover:shadow-md">
                                    <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start gap-6">

                                        {/* Company Logo Square */}
                                        <div className="w-[72px] h-[72px] rounded-[1.25rem] border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center shrink-0">
                                            {/* Placeholder for real logos, using initial for now */}
                                            <span className="text-2xl font-black text-neutral-300 dark:text-neutral-600 uppercase">{job.company.charAt(0)}</span>
                                        </div>

                                        {/* Core Job Info */}
                                        <div className="flex-1 min-w-0 flex flex-col pt-1">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div>
                                                    <Link href={`/jobs/${job.id}`}>
                                                        <h3 className="text-[22px] font-bold text-black dark:text-white hover:underline decoration-2 underline-offset-4 tracking-tight leading-none mb-2 truncate">
                                                            {job.title}
                                                        </h3>
                                                    </Link>
                                                    <div className="flex items-center text-[15px] font-medium text-neutral-500 dark:text-neutral-400">
                                                        <span>{job.company}</span>
                                                        <span className="mx-2 text-neutral-300 dark:text-neutral-600">•</span>
                                                        <span>{job.location}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center shrink-0 gap-3">
                                                    {/* AI Match Score Pill */}
                                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 ${job.matchScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        {job.matchScore}% Match
                                                    </div>
                                                    {/* Save Button */}
                                                    <div className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                                                        <SaveJobButton jobId={job.id} initialSaved={job.isSaved} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Structured Meta Data Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-neutral-100/60 dark:border-neutral-800/60">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">Experience</div>
                                                    <div className="text-[15px] font-semibold text-[#111827] dark:text-neutral-200">1 to 3 Years</div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">Job Type</div>
                                                    <div className="text-[15px] font-semibold text-[#111827] dark:text-neutral-200">{job.type}</div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">Salary</div>
                                                    <div className="text-[15px] font-bold text-black dark:text-white">{job.salary}</div>
                                                </div>
                                                <div className="flex items-end justify-end">
                                                    <div className="text-[11px] font-semibold tracking-wide text-neutral-400 dark:text-neutral-500">
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
                        {/* Promo Block: Match / Upload (Shrunk Minimalist Version) */}
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white dark:bg-neutral-950 rounded-[14px] flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-sm shrink-0">
                                    <FileText className="h-5 w-5 text-black dark:text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-black dark:text-white tracking-tight leading-tight">Match with<br />your resume</h3>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed mb-6">
                                We'll extract your skills and instantly match you with jobs.
                            </p>

                            <div className="w-full mt-auto">
                                {isSeeker ? (
                                    <Link href="/dashboard/profile" className="block w-full">
                                        <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold rounded-xl shadow-sm transition-transform active:scale-95 text-sm h-11">
                                            Update Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/auth/signup" className="block w-full">
                                        <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold rounded-xl shadow-sm transition-transform active:scale-95 text-sm h-11">
                                            Sign up to match
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
