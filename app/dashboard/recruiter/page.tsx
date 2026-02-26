import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, PlusCircle, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Job, Applicant } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function RecruiterDashboard() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/auth/login');
    }

    // 1. Fetch or sync the Recruiter user in DB
    let recruiter = await prisma.user.findUnique({
        where: { clerkId: userId }
    });

    if (!recruiter) {
        recruiter = await prisma.user.create({
            data: {
                clerkId: userId,
                email: `user_${userId}@clerk.local`, // Fallback
                role: 'RECRUITER'
            }
        });
    }

    // 2. Fetch Jobs posted by this Recruiter
    const jobs = await prisma.job.findMany({
        where: { recruiterId: recruiter.id },
        orderBy: { postedAt: 'desc' }
    });

    // 3. Fetch all Applicants for these Jobs to calculate stats
    const jobIds = jobs.map((j: Job) => j.id);
    const allApplicants = await prisma.applicant.findMany({
        where: { jobId: { in: jobIds } }
    });

    // Calculate basic stats
    const activeJobsCount = jobs.length;
    const totalApplicantsCount = allApplicants.length;
    const interviewsCount = allApplicants.filter((a: Applicant) => a.status === 'Interview').length;

    return (
        <div className="container max-w-6xl mx-auto py-10 px-4 mt-16 lg:mt-24">
            {/* Header section */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Active Postings</p>
                            <h3 className="text-3xl font-bold text-white">{activeJobsCount}</h3>
                        </div>
                        <div className="h-12 w-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-indigo-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Total Candidates</p>
                            <h3 className="text-3xl font-bold text-white">{totalApplicantsCount}</h3>
                        </div>
                        <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Interviews Scheduled</p>
                            <h3 className="text-3xl font-bold text-white">{interviewsCount}</h3>
                        </div>
                        <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-amber-400" />
                        </div>
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
                        <Card key={job.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                                {/* Job Info */}
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

                                {/* Pipeline Mini-Stats */}
                                <div className="flex items-center gap-6 px-6 py-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
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

                                {/* Actions */}
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
                        <p className="text-slate-400 max-w-sm mx-auto mb-6">You haven't posted any jobs yet. Create your first listing to start finding AI-matched candidates.</p>
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
