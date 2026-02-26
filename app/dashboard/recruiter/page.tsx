import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, PlusCircle, TrendingUp, Target, BarChart3, CalendarDays } from "lucide-react";
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Job, Applicant } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PipelineChart, TimelineChart } from './Charts';

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
        <div className="container max-w-6xl mx-auto py-10 px-4 mt-16 lg:mt-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Recruiter Dashboard</h1>
                    <p className="text-slate-400">Manage your active job postings and AI-matched candidates.</p>
                </div>
                <Link href="/dashboard/recruiter/post-job">
                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post New Job
                    </Button>
                </Link>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Active Postings</p>
                            <h3 className="text-2xl font-bold text-white">{activeJobsCount}</h3>
                        </div>
                        <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-indigo-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Total Candidates</p>
                            <h3 className="text-2xl font-bold text-white">{totalApplicantsCount}</h3>
                        </div>
                        <div className="h-10 w-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Avg Match Score</p>
                            <h3 className={`text-2xl font-bold ${avgMatchScore > 70 ? 'text-green-400' : 'text-amber-400'}`}>{avgMatchScore}%</h3>
                        </div>
                        <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                            <Target className="h-5 w-5 text-amber-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Conversion Rate</p>
                            <h3 className="text-2xl font-bold text-emerald-400">{conversionRate}%</h3>
                        </div>
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-white">
                            <BarChart3 className="h-5 w-5 text-indigo-400" />
                            Candidate Pipeline
                        </CardTitle>
                        <CardDescription>Applicants by stage across all jobs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {totalApplicantsCount > 0 ? (
                            <PipelineChart data={pipelineData} />
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
                                No applicant data yet. Post a job to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-white">
                            <CalendarDays className="h-5 w-5 text-indigo-400" />
                            Applications Over Time
                        </CardTitle>
                        <CardDescription>Application trends — last 14 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {totalApplicantsCount > 0 ? (
                            <TimelineChart data={timelineData} />
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
                                No application data yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Active Jobs List */}
            <h2 className="text-xl font-bold text-white mb-6">Your Active Jobs</h2>
            <div className="flex flex-col gap-4">
                {jobs.map((job: Job) => {
                    const jobApplicants = allApplicants.filter((a: Applicant) => a.jobId === job.id);
                    const topMatch = jobApplicants.length > 0
                        ? Math.max(...jobApplicants.map((a: Applicant) => a.matchScore))
                        : 0;

                    return (
                        <Card key={job.id} className="bg-slate-900/80 border-slate-800 hover:border-indigo-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5">
                            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                                            {job.type}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-slate-400 flex flex-wrap gap-x-4 gap-y-2">
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                            Active
                                        </span>
                                        <span>• {job.location}</span>
                                        <span>• Posted {job.postedAt.toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 px-6 py-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Candidates</p>
                                        <p className="text-xl font-semibold text-white">{jobApplicants.length}</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-800"></div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Top Match</p>
                                        <p className={`text-xl font-semibold ${topMatch > 85 ? 'text-green-400' : 'text-amber-400'}`}>
                                            {topMatch > 0 ? `${topMatch}%` : '--'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <Link href={`/dashboard/recruiter/jobs/${job.id}/applicants`} className="w-full md:w-auto">
                                        <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                                            View Pipeline
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {jobs.length === 0 && (
                    <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl border-dashed">
                        <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No active jobs</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-6">You haven&apos;t posted any jobs yet. Create your first listing to start finding AI-matched candidates.</p>
                        <Link href="/dashboard/recruiter/post-job">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Post a Job Now
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
