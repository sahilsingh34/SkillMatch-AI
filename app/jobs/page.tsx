import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, MapPin, DollarSign, Clock, Search, SlidersHorizontal, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";
import { SaveJobButton } from './SaveJobButton';

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
        type?: string
    }>
}) {
    const params = await searchParams;
    const userSkillsParam = params.skills;
    const page = parseInt(params.page || "1");
    const sort = params.sort || "newest";
    const search = params.search || "";
    const typeFilter = params.type || "";
    const limit = 6;
    const skip = (page - 1) * limit;

    let userSkills: string[] = userSkillsParam ? userSkillsParam.split(',') : [];

    const { userId } = await auth();
    let savedJobIds: Set<string> = new Set();

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

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl mt-16 lg:mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Find Your Next Role</h1>
                    <p className="text-slate-400">AI-matched opportunities updated in real-time.</p>
                </div>

                <form className="flex w-full md:w-auto max-w-md items-center space-x-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
                    <Input
                        name="search"
                        defaultValue={search}
                        placeholder="Search title, skills..."
                        className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-slate-500"
                    />
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-9 px-4">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </form>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 space-y-8 shrink-0 md:sticky md:top-24 h-fit">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Sort By</h3>
                        <div className="flex flex-col gap-2">
                            <Link href={`/jobs?sort=newest&search=${search}&type=${typeFilter}`}>
                                <Button variant={sort === 'newest' ? 'secondary' : 'ghost'} className="w-full justify-start h-9 text-sm">
                                    Newest First
                                </Button>
                            </Link>
                            <Link href={`/jobs?sort=match&search=${search}&type=${typeFilter}`}>
                                <Button variant={sort === 'match' ? 'secondary' : 'ghost'} className="w-full justify-start h-9 text-sm">
                                    AI Match Score
                                </Button>
                            </Link>
                            <Link href={`/jobs?sort=salary_desc&search=${search}&type=${typeFilter}`}>
                                <Button variant={sort === 'salary_desc' ? 'secondary' : 'ghost'} className="w-full justify-start h-9 text-sm">
                                    Highest Salary
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Employment Type</h3>
                        <div className="flex flex-col gap-2">
                            {["", "Full-time", "Contract", "Remote", "Freelance"].map((type) => (
                                <Link key={type} href={`/jobs?type=${type}&sort=${sort}&search=${search}`}>
                                    <Button variant={typeFilter === type ? 'secondary' : 'ghost'} className="w-full justify-start h-9 text-sm">
                                        {type === "" ? "Any Type" : type}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Job Listings */}
                <div className="flex-1 space-y-6">
                    <div className="grid gap-4">
                        {displayJobs.map((job) => (
                            <Card key={job.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 group transition-all duration-300 backdrop-blur-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Link href={`/jobs/${job.id}`}>
                                                        <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                            {job.title}
                                                        </h2>
                                                    </Link>
                                                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-2 py-0">
                                                        {job.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-400 font-medium">{job.company}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-right hidden sm:block">
                                                    <div className={`text-sm font-bold flex items-center gap-1 ${job.matchScore >= 80 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        {job.matchScore}% AI Match
                                                    </div>
                                                </div>
                                                <SaveJobButton jobId={job.id} initialSaved={job.isSaved} />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-slate-500" /> {job.location}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <DollarSign className="h-4 w-4 text-slate-500" /> {job.salary}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-slate-500" /> {job.postedAt.toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.split(',').slice(0, 5).map((skill: string) => (
                                                <span key={skill} className="px-2 py-0.5 bg-slate-800/50 text-slate-300 text-[11px] font-medium rounded border border-slate-700/50 uppercase tracking-tighter">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                            {job.skills.split(',').length > 5 && (
                                                <span className="text-[11px] text-slate-600 font-medium self-center">+{job.skills.split(',').length - 5} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-slate-950/30 border-t border-slate-800/50 flex justify-end">
                                        <Link href={`/jobs/${job.id}`}>
                                            <Button variant="ghost" className="text-sm text-indigo-400 hover:text-indigo-300 hover:bg-transparent p-0 group-hover:translate-x-1 transition-transform">
                                                View Details & Apply
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {displayJobs.length === 0 && (
                            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl border-dashed">
                                <Search className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">No jobs matched your search</h3>
                                <p className="text-slate-400 max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-8">
                            <Link href={`/jobs?page=${Math.max(1, page - 1)}&sort=${sort}&search=${search}&type=${typeFilter}`}>
                                <Button variant="outline" size="icon" disabled={page === 1} className="bg-slate-900 border-slate-800 text-slate-400">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link key={i} href={`/jobs?page=${i + 1}&sort=${sort}&search=${search}&type=${typeFilter}`}>
                                    <Button
                                        variant={page === i + 1 ? "secondary" : "outline"}
                                        className={`h-9 w-9 p-0 ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                                    >
                                        {i + 1}
                                    </Button>
                                </Link>
                            ))}
                            <Link href={`/jobs?page=${Math.min(totalPages, page + 1)}&sort=${sort}&search=${search}&type=${typeFilter}`}>
                                <Button variant="outline" size="icon" disabled={page === totalPages} className="bg-slate-900 border-slate-800 text-slate-400">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
