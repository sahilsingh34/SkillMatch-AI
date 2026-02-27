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

        if (!recruiter) {
            recruiter = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: `user_${userId}@clerk.local`,
                    role: 'RECRUITER'
                }
            });
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
        Applied: "#6366f1", Screening: "#3b82f6", Interview: "#f59e0b",
        Offered: "#22c55e", Rejected: "#ef4444"
    };
    const pipelineData = stages.map(stage => ({
        stage,
        count: allApplicants.filter((a: Applicant) => a.status === stage).length,
        fill: stageColors[stage] || "#6366f1"
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
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="h-48 bg-white border-b border-slate-100 flex items-end pb-10">
                <div className="container max-w-6xl mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Recruiter Dashboard</h1>
                            <p className="text-lg text-slate-500 font-medium">Manage your active job postings and AI-matched candidates.</p>
                        </div>
                        <Link href="/dashboard/recruiter/post-job">
                            <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-6 rounded-xl shadow-sm transition-all">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Post New Job
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 lg:px-8 -mt-6">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Active Postings</p>
                                <h3 className="text-3xl font-extrabold text-slate-900">{activeJobsCount}</h3>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Candidates</p>
                                <h3 className="text-3xl font-extrabold text-slate-900">{totalApplicantsCount}</h3>
                            </div>
                            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Match Score</p>
                                <h3 className={`text-3xl font-extrabold ${avgMatchScore > 70 ? 'text-emerald-600' : 'text-amber-500'}`}>{avgMatchScore}%</h3>
                            </div>
                            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                                <Target className="h-6 w-6 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Conversion Rate</p>
                                <h3 className="text-3xl font-extrabold text-slate-900">{conversionRate}%</h3>
                            </div>
                            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                <TrendingUp className="h-6 w-6 text-slate-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-900">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                                </div>
                                Candidate Pipeline
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-500 mt-1">Applicants by stage across all jobs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {totalApplicantsCount > 0 ? (
                                <PipelineChart data={pipelineData} />
                            ) : (
                                <div className="flex items-center justify-center h-[280px] text-slate-400 font-medium text-sm border-2 border-dashed border-slate-100 rounded-xl m-2 bg-slate-50/50">
                                    No applicant data yet. Post a job to get started.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-900">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-emerald-600" />
                                </div>
                                Applications Over Time
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-500 mt-1">Application trends — last 14 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {totalApplicantsCount > 0 ? (
                                <TimelineChart data={timelineData} />
                            ) : (
                                <div className="flex items-center justify-center h-[280px] text-slate-400 font-medium text-sm border-2 border-dashed border-slate-100 rounded-xl m-2 bg-slate-50/50">
                                    No application data yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Active Jobs List */}
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 mt-14">Your Active Jobs</h2>
                <div className="flex flex-col gap-5">
                    {jobs.map((job: Job) => {
                        const jobApplicants = allApplicants.filter((a: Applicant) => a.jobId === job.id);
                        const topMatch = jobApplicants.length > 0
                            ? Math.max(...jobApplicants.map((a: Applicant) => a.matchScore))
                            : 0;

                        return (
                            <Card key={job.id} className="bg-white border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 rounded-2xl overflow-hidden group">
                                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                            <Badge variant="outline" className="border-slate-200 text-slate-500 bg-slate-50 px-2.5 py-0.5 font-semibold">
                                                {job.type}
                                            </Badge>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <span className="flex items-center justify-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                                Active
                                            </span>
                                            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location}</span>
                                            <span className="flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1 text-slate-400" /> Posted {job.postedAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 md:gap-8 items-center justify-between md:justify-end w-full md:w-auto">
                                        <div className="flex items-center gap-6 px-6 py-4 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Candidates</p>
                                                <p className="text-2xl font-extrabold text-slate-900">{jobApplicants.length}</p>
                                            </div>
                                            <div className="w-px h-10 bg-slate-200"></div>
                                            <div className="text-center flex flex-col items-center">
                                                <p className="text-[10px] font-bold flex items-center gap-1 text-slate-400 uppercase tracking-widest mb-1.5">
                                                    <Sparkles className="w-3 h-3 text-emerald-500 relative -top-px" />
                                                    Top Match
                                                </p>
                                                <p className={`text-2xl font-extrabold ${topMatch > 85 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                    {topMatch > 0 ? `${topMatch}%` : '--'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center shrink-0">
                                            <Link href={`/dashboard/recruiter/jobs/${job.id}/applicants`} className="w-full sm:w-auto">
                                                <Button variant="secondary" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-5 rounded-lg shadow-sm">
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
                        <div className="text-center py-20 bg-white shadow-sm border border-slate-100 rounded-[2rem] border-dashed">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100">
                                <Briefcase className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No active jobs</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">You haven&apos;t posted any jobs yet. Create your first listing to start finding AI-matched candidates.</p>
                            <Link href="/dashboard/recruiter/post-job">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-xl shadow-sm">
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
