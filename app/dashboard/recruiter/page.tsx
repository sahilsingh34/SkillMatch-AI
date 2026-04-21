import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, PlusCircle, TrendingUp, Target, BarChart3, CalendarDays, MapPin, Sparkles } from "lucide-react";
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Job, Applicant } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PipelineChart, TimelineChart } from './Charts';
import { JobManagementButtons } from './JobManagementButtons';

export default async function RecruiterDashboard() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/auth/login');
    }

    let recruiter: any = null;
    let jobs: Job[] = [];
    let allApplicants: Applicant[] = [];

    try {
        recruiter = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!recruiter || recruiter.role !== 'RECRUITER') {
            redirect('/onboarding');
        }

        jobs = await prisma.job.findMany({
            where: { recruiterId: recruiter.id },
            orderBy: { postedAt: 'desc' }
        });

        const jobIds = jobs.map((j: Job) => j.id);
        if (jobIds.length > 0) {
            allApplicants = await prisma.applicant.findMany({
                where: { jobId: { in: jobIds } }
            });
        }
    } catch (e) {
        console.error("Recruiter Dashboard: DB error", e);
    }

    // Stats
    const activeJobsCount = jobs.length;
    const totalApplicantsCount = allApplicants.length;
    const interviewsCount = allApplicants.filter((a: Applicant) => a.status === 'Interview').length;
    const offeredCount = allApplicants.filter((a: Applicant) => a.status === 'Offered').length;
    const avgMatchScore = totalApplicantsCount > 0
        ? Math.round(allApplicants.reduce((sum: number, a: Applicant) => sum + a.matchScore, 0) / totalApplicantsCount)
        : 0;
    const conversionRate = totalApplicantsCount > 0
        ? ((offeredCount / totalApplicantsCount) * 100).toFixed(1)
        : "0.0";

    // Pipeline chart data
    const stages = ["Applied", "Screening", "Interview", "Offered", "Rejected"];
    const stageColors: Record<string, string> = {
        Applied: "#171717", Screening: "#404040", Interview: "#737373",
        Offered: "#000000", Rejected: "#a3a3a3"
    };
    const pipelineData = stages.map(stage => ({
        stage,
        count: allApplicants.filter((a: Applicant) => a.status === stage).length,
        fill: stageColors[stage] || "#171717"
    }));

    // Timeline chart data (last 14 days)
    const timelineData: { date: string; applications: number }[] = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayEnd = new Date(dayStart.getTime() + 86400000);
        const count = allApplicants.filter((a: Applicant) => {
            const t = new Date(a.appliedAt);
            return t >= dayStart && t < dayEnd;
        }).length;
        timelineData.push({ date: dateStr, applications: count });
    }

    return (
        <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 transition-colors">
            <div className="pt-28 pb-8 bg-neutral-50/50 dark:bg-neutral-900/20 border-b border-neutral-200 dark:border-neutral-800 flex items-end">
                <div className="container max-w-6xl mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-2">Recruiter Dashboard</h1>
                            <p className="text-[17px] text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">Manage your active job postings and AI-matched candidates.</p>
                        </div>
                        <Link href="/dashboard/recruiter/post-job">
                            <Button className="w-full md:w-auto bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold h-12 px-6 rounded-xl shadow-sm transition-all text-[15px]">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Post New Job
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 lg:px-8 mt-10">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Active Postings</p>
                                <h3 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">{activeJobsCount}</h3>
                            </div>
                            <div className="h-12 w-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                                <Briefcase className="h-5 w-5 text-black dark:text-white" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Total Candidates</p>
                                <h3 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">{totalApplicantsCount}</h3>
                            </div>
                            <div className="h-12 w-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                                <Users className="h-5 w-5 text-black dark:text-white" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Avg Match Score</p>
                                <h3 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">{avgMatchScore}%</h3>
                            </div>
                            <div className="h-12 w-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                                <Target className="h-5 w-5 text-black dark:text-white" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Conversion Rate</p>
                                <h3 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">{conversionRate}%</h3>
                            </div>
                            <div className="h-12 w-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                                <TrendingUp className="h-5 w-5 text-black dark:text-white" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow rounded-[2rem] p-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-3 text-black dark:text-white tracking-tight">
                                <div className="p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                                    <BarChart3 className="h-5 w-5 text-black dark:text-white" />
                                </div>
                                Candidate Pipeline
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Applicants by stage across all jobs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {totalApplicantsCount > 0 ? (
                                <PipelineChart data={pipelineData} />
                            ) : (
                                <div className="flex items-center justify-center h-[280px] text-neutral-400 dark:text-neutral-500 font-medium text-sm border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl m-2 bg-neutral-50/50 dark:bg-neutral-900/20">
                                    No applicant data yet. Post a job to get started.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow rounded-[2rem] p-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-3 text-black dark:text-white tracking-tight">
                                <div className="p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-black dark:text-white" />
                                </div>
                                Applications Over Time
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Application trends — last 14 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {totalApplicantsCount > 0 ? (
                                <TimelineChart data={timelineData} />
                            ) : (
                                <div className="flex items-center justify-center h-[280px] text-neutral-400 dark:text-neutral-500 font-medium text-sm border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl m-2 bg-neutral-50/50 dark:bg-neutral-900/20">
                                    No application data yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Active Jobs List */}
                <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 mt-14">Your Active Jobs</h2>
                <div className="flex flex-col gap-5">
                    {jobs.map((job: Job) => {
                        const jobApplicants = allApplicants.filter((a: Applicant) => a.jobId === job.id);
                        const topMatch = jobApplicants.length > 0
                            ? Math.max(...jobApplicants.map((a: Applicant) => a.matchScore))
                            : 0;

                        return (
                            <Card key={job.id} className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-md rounded-[2rem] overflow-hidden group">
                                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-[22px] font-bold tracking-tight text-black dark:text-white group-hover:underline decoration-2 underline-offset-4 transition-all">{job.title}</h3>
                                            <Badge variant="outline" className="border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 px-2.5 py-0.5 font-bold">
                                                {job.type}
                                            </Badge>
                                        </div>
                                        <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <span className="flex items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 text-black dark:text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-neutral-200 dark:border-neutral-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mr-1.5 animate-pulse"></span>
                                                Active
                                            </span>
                                            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-neutral-400 dark:text-neutral-500" /> {job.location}</span>
                                            <span className="flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1.5 text-neutral-400 dark:text-neutral-500" /> Posted {job.postedAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 md:gap-8 items-center justify-between md:justify-end w-full md:w-auto">
                                        <div className="flex items-center justify-around md:justify-center gap-4 md:gap-6 px-4 md:px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full md:w-auto">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Candidates</p>
                                                <p className="text-xl md:text-[22px] font-extrabold text-black dark:text-white">{jobApplicants.length}</p>
                                            </div>
                                            <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>
                                            <div className="text-center flex flex-col items-center">
                                                <p className="text-[10px] font-bold flex items-center gap-1 text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">
                                                    <Sparkles className="w-3 h-3 text-black dark:text-white relative -top-px" />
                                                    Top Match
                                                </p>
                                                <p className={`text-xl md:text-[22px] font-extrabold text-black dark:text-white`}>
                                                    {topMatch > 0 ? `${topMatch}%` : '--'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center shrink-0">
                                            <Link href={`/dashboard/recruiter/jobs/${job.id}/applicants`} className="w-full sm:w-auto">
                                                <Button variant="secondary" className="w-full bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold h-12 px-6 rounded-xl shadow-sm border border-transparent">
                                                    View Pipeline
                                                </Button>
                                            </Link>
                                            <JobManagementButtons jobId={job.id} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {jobs.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] shadow-sm border border-neutral-200 dark:border-neutral-800 rounded-[2rem] border-dashed">
                            <div className="h-16 w-16 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-neutral-200 dark:border-neutral-800">
                                <Briefcase className="h-7 w-7 text-black dark:text-white" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-black dark:text-white mb-2">No active jobs</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium max-w-sm mx-auto mb-8">You haven&apos;t posted any jobs yet. Create your first listing to start finding AI-matched candidates.</p>
                            <Link href="/dashboard/recruiter/post-job">
                                <Button className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold h-12 px-8 rounded-xl shadow-sm">
                                    Post a Job Now
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
