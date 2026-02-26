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
        <div className="container max-w-6xl mx-auto py-10 px-4 mt-16 lg:mt-24">
            <Link href="/dashboard/recruiter" className="text-sm text-slate-400 hover:text-white flex items-center mb-6 w-fit transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="mb-10 pb-6 border-b border-slate-800">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Applicant Pipeline
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-slate-400">
                    <span className="font-medium text-slate-300">{job.title}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {applicants.length} Total Applicants
                    </Badge>
                </div>
            </div>

            {/* Pipeline View */}
            <div className="space-y-6">
                {applicants.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-xl border-dashed">
                        <UserCircle2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No applicants yet</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Your job posting is live! When candidates apply and are processed by our AI parsing engine, they will appear here automatically ranked by match score.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applicants.map((applicant, index) => (
                            <Card
                                key={applicant.id}
                                className={`bg-slate-900 border-slate-800 hover:border-slate-700 transition-all ${index === 0 ? 'ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : ''}`}
                            >
                                <CardContent className="p-6">
                                    {/* Top Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <UserCircle2 className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{applicant.user?.firstName || 'Candidate'} {applicant.user?.lastName || ''}</h3>
                                                <p className="text-xs text-slate-500">Applied {applicant.appliedAt.toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* AI Match Badge */}
                                        <div className="flex flex-col items-end">
                                            <div className={`flex items-center gap-1 font-bold ${applicant.matchScore >= 90 ? 'text-green-400' :
                                                applicant.matchScore >= 75 ? 'text-indigo-400' : 'text-amber-400'
                                                }`}>
                                                <Sparkles className="h-4 w-4" />
                                                {applicant.matchScore}%
                                            </div>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">AI Match</span>
                                        </div>
                                    </div>

                                    {/* Contact Info & Experience */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-slate-400">
                                            <Mail className="h-3.5 w-3.5 mr-2" />
                                            {applicant.user?.email || 'No email provided'}
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-2 border-y border-slate-800/50 mt-4">
                                            <span className="text-slate-500">Experience</span>
                                            <span className="text-slate-300 font-medium">{applicant.user?.profile?.experience || applicant.experience} Years</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm pb-2 border-b border-slate-800/50">
                                            <span className="text-slate-500">Current Stage</span>
                                            <StatusDropdown applicantId={applicant.id} currentStatus={applicant.status} />
                                        </div>
                                    </div>

                                    {/* Skills Mini-Fingerprint */}
                                    <div className="mb-6">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">AI Extracted Skills</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(applicant.user?.profile?.skills.split(',') || applicant.skills.split(',')).slice(0, 5).map((skill: string) => (
                                                <span key={skill.trim()} className="px-2 py-0.5 bg-slate-800/80 text-slate-300 text-xs rounded border border-slate-700/50">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                            {(applicant.user?.profile?.skills.split(',').length || applicant.skills.split(',').length) > 5 && (
                                                <span className="px-2 py-0.5 bg-slate-800/40 text-slate-500 text-xs rounded border border-slate-800">
                                                    +{((applicant.user?.profile?.skills.split(',').length || applicant.skills.split(',').length)) - 5}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-6">
                                        <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm h-9">
                                            Review Profile
                                        </Button>
                                        <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800 bg-transparent flex-shrink-0 h-9 w-9" asChild>
                                            <a href={applicant.user?.profile?.resumeUrl || '#'} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 text-slate-400" />
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
    );
}
