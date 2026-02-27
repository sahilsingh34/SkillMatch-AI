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
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="h-40 bg-white border-b border-slate-100 flex items-end pb-8">
                <div className="container max-w-6xl mx-auto px-4 lg:px-8">
                    <Link href="/dashboard/recruiter" className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center mb-6 w-fit transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                                Applicant Pipeline
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                                <span className="text-slate-700">{job?.title}</span>
                                <span className="text-slate-300">•</span>
                                <span>{job?.location}</span>
                                <span className="text-slate-300">•</span>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-bold">
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
                        <div className="text-center py-20 bg-white shadow-sm border border-slate-100 rounded-[2rem] border-dashed">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100">
                                <UserCircle2 className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No applicants yet</h3>
                            <p className="text-slate-500 font-medium max-w-md mx-auto">
                                Your job posting is live! When candidates apply and are processed by our AI parsing engine, they will appear here automatically ranked by match score.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applicants.map((applicant, index) => (
                                <Card
                                    key={applicant.id}
                                    className={`bg-white border-none shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${index === 0 ? 'ring-2 ring-emerald-500/20' : ''}`}
                                >
                                    {index === 0 && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                                    )}
                                    <CardContent className="p-6">
                                        {/* Top Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                                                    <UserCircle2 className="h-7 w-7 text-slate-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900">{applicant.user?.firstName || 'Candidate'} {applicant.user?.lastName || ''}</h3>
                                                    <p className="text-xs font-semibold text-slate-500 flex items-center">Applied {applicant.appliedAt.toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* AI Match Badge */}
                                            <div className="flex flex-col items-end">
                                                <div className={`flex items-center gap-1 font-extrabold text-xl ${applicant.matchScore >= 90 ? 'text-emerald-600' :
                                                    applicant.matchScore >= 75 ? 'text-blue-600' : 'text-amber-500'
                                                    }`}>
                                                    <Sparkles className="h-5 w-5" />
                                                    {applicant.matchScore}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info & Experience */}
                                        <div className="space-y-3 mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <div className="flex items-center text-sm font-medium text-slate-600">
                                                <Mail className="h-4 w-4 mr-2.5 text-slate-400" />
                                                {applicant.user?.email || 'No email provided'}
                                            </div>
                                            <div className="flex items-center justify-between text-sm py-2 border-y border-slate-200">
                                                <span className="text-slate-500 font-semibold">Experience</span>
                                                <span className="text-slate-900 font-bold">{applicant.user?.profile?.experience || applicant.experience} Years</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm pt-2">
                                                <span className="text-slate-500 font-semibold">Current Stage</span>
                                                <div>
                                                    <StatusDropdown applicantId={applicant.id} currentStatus={applicant.status} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills Mini-Fingerprint */}
                                        <div className="mb-6">
                                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center">
                                                <Sparkles className="w-3 h-3 justify-center mr-1 text-indigo-400" />
                                                AI Extracted Skills
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {(applicant.user?.profile?.skills.split(',') || applicant.skills.split(',')).slice(0, 5).map((skill: string) => (
                                                    <span key={skill.trim()} className="px-2.5 py-1 bg-white shadow-sm text-slate-700 font-semibold text-xs rounded-full border border-slate-200">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                                {(applicant.user?.profile?.skills.split(',').length || applicant.skills.split(',').length) > 5 && (
                                                    <span className="px-2 py-1 bg-slate-100 font-semibold text-slate-500 text-xs rounded-full border border-transparent">
                                                        +{((applicant.user?.profile?.skills.split(',').length || applicant.skills.split(',').length)) - 5}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 mt-auto pt-2">
                                            <Button variant="secondary" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm h-11 rounded-lg">
                                                Review Profile
                                            </Button>
                                            <Button size="icon" variant="outline" className="border-slate-200 hover:bg-slate-50 hover:border-blue-200 text-slate-700 flex-shrink-0 h-11 w-11 rounded-lg transition-colors" asChild>
                                                <a href={applicant.user?.profile?.resumeUrl || '#'} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-5 w-5" />
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
