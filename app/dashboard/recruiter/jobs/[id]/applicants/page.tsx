import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle2, Mail, ExternalLink, Sparkles } from "lucide-react";
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { StatusDropdown } from './StatusDropdown';

export default async function ApplicantsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const jobId = params.id;

    const job = await prisma.job.findUnique({
        where: { id: jobId }
    });

    if (!job) {
        notFound();
    }

    const applicants = await prisma.applicant.findMany({
        where: { jobId: jobId },
        include: {
            user: {
                include: { profile: true as any }
            }
        },
        orderBy: { matchScore: 'desc' }
    }) as any[];

    return (
        <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 transition-colors">
            <div className="pt-28 pb-8 bg-neutral-50/50 dark:bg-neutral-900/20 border-b border-neutral-200 dark:border-neutral-800 flex items-end">
                <div className="container max-w-6xl mx-auto px-4 lg:px-8">
                    <Link href="/dashboard/recruiter" className="text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white flex items-center mb-6 w-fit transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-2">
                                Applicant Pipeline
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium text-neutral-500 dark:text-neutral-400">
                                <span className="text-black dark:text-white">{job?.title}</span>
                                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                                <span>{job?.location}</span>
                                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                                <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border-none font-bold">
                                    {applicants.length} Total Applicants
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 lg:px-8 pt-10">
                {/* Pipeline View */}
                <div className="space-y-6">
                    {applicants.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] shadow-sm border border-neutral-200 dark:border-neutral-800 rounded-[2rem] border-dashed">
                            <div className="h-16 w-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-5 border border-neutral-200 dark:border-neutral-800">
                                <UserCircle2 className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2 tracking-tight">No applicants yet</h3>
                            <p className="text-neutral-500 font-medium max-w-md mx-auto text-[15px]">
                                Your job posting is live! When candidates apply and are processed by our AI parsing engine, they will appear here automatically ranked by match score.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applicants.map((applicant, index) => (
                                <Card
                                    key={applicant.id}
                                    className={`bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${index === 0 ? 'ring-2 ring-black dark:ring-white border-transparent' : ''}`}
                                >
                                    {index === 0 && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-white"></div>
                                    )}
                                    <CardContent className="p-6">
                                        {/* Top Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                                                    <UserCircle2 className="h-7 w-7 text-neutral-400 dark:text-neutral-600" />
                                                </div>
                                                <div className="min-w-0 pr-2">
                                                    <h3 className="font-bold text-lg text-black dark:text-white tracking-tight truncate">{applicant.user?.firstName || 'Candidate'} {applicant.user?.lastName || ''}</h3>
                                                    <p className="text-xs font-bold text-neutral-500 flex items-center">Applied {applicant.appliedAt.toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* AI Match Badge */}
                                            <div className="flex flex-col items-end flex-shrink-0">
                                                <div className="flex items-center gap-1 font-extrabold text-xl text-black dark:text-white tracking-tight">
                                                    <Sparkles className="h-5 w-5" />
                                                    {applicant.matchScore}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info & Experience */}
                                        <div className="space-y-3 mb-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
                                            <div className="flex items-center text-sm font-bold text-neutral-600 dark:text-neutral-400 truncate overflow-hidden">
                                                <Mail className="h-4 w-4 mr-2 text-black dark:text-white flex-shrink-0" />
                                                <span className="truncate">{applicant.user?.email || 'No email provided'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm py-2 border-y border-neutral-200 dark:border-neutral-800">
                                                <span className="text-neutral-500 dark:text-neutral-400 font-bold">Experience</span>
                                                <span className="text-black dark:text-white font-bold">{applicant.user?.profile?.experience || applicant.experience} Years</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm pt-2">
                                                <span className="text-neutral-500 dark:text-neutral-400 font-bold">Current Stage</span>
                                                <div>
                                                    <StatusDropdown applicantId={applicant.id} currentStatus={applicant.status} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills Mini-Fingerprint */}
                                        <div className="mb-6">
                                            <p className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest mb-3 flex items-center">
                                                <Sparkles className="w-3 h-3 justify-center mr-1" />
                                                AI Extracted Skills
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {(applicant.user?.profile?.skills.split(',') || applicant.skills.split(',')).slice(0, 5).map((skill: string) => (
                                                    <span key={skill.trim()} className="px-2.5 py-1 bg-white dark:bg-[#0a0a0a] shadow-sm text-black dark:text-white font-bold text-[11px] uppercase tracking-wider rounded-full border border-neutral-200 dark:border-neutral-800">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                                {(applicant.user?.profile?.skills.split(',').length || applicant.skills.split(',').length) > 5 && (
                                                    <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 font-bold text-neutral-500 dark:text-neutral-400 text-[11px] rounded-full border border-transparent">
                                                        +{((applicant.user?.profile?.skills.split(',').length || applicant.skills.split(',').length)) - 5}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto pt-2">
                                            <Button className="w-full bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold text-[15px] h-11 rounded-xl shadow-sm transition-all hover:shadow-md" asChild>
                                                <a href={applicant.user?.profile?.resumeUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                                    View Resume
                                                    <ExternalLink className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
