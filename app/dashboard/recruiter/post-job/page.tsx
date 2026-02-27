"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createJobAction } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

export default function PostJobPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{ skills: string[] } | null>(null);

    async function onSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const result = await createJobAction(formData);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else if (result.success) {
            setSuccess({ skills: result.skills || [] });
            setIsSubmitting(false);
            // Wait a moment then redirect to dashboard
            setTimeout(() => {
                router.push('/dashboard/recruiter');
                router.refresh();
            }, 3000);
        }
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="h-40 bg-slate-50 border-b border-slate-100 flex items-end pb-8">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <Link href="/dashboard/recruiter" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 max-w-6xl -mt-4">
                <div className="mb-10 pt-6">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Post a New Job</h1>
                    <p className="text-lg text-slate-500">Fill out the role details. Our AI will automatically extract the required core skills from your description.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Form Column */}
                    <div className="md:col-span-2">
                        <form action={onSubmit}>
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                                {error && (
                                    <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-slate-700 font-bold">Job Title <span className="text-blue-600">*</span></Label>
                                            <Input id="title" name="title" placeholder="e.g. Senior Frontend Engineer" required className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="text-slate-700 font-bold">Company / Team <span className="text-blue-600">*</span></Label>
                                            <Input id="company" name="company" placeholder="e.g. TechNova" required className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-slate-700 font-bold">Location</Label>
                                            <Input id="location" name="location" placeholder="e.g. Remote, NY" defaultValue="Remote" className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="text-slate-700 font-bold">Job Type</Label>
                                            <Input id="type" name="type" placeholder="e.g. Full-time" defaultValue="Full-time" className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="salary" className="text-slate-700 font-bold">Salary Range</Label>
                                            <Input id="salary" name="salary" placeholder="e.g. $120k-$150k" className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label htmlFor="description" className="text-slate-700 font-bold">Job Description <span className="text-blue-600">*</span></Label>
                                            <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded-full"><Sparkles className="w-3 h-3 mr-1" /> AI Scanned</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">Aim for detail. Gemini AI will scan this to build the required skillset (AI Skill Fingerprint).</p>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe the role, responsibilities, and qualifications..."
                                            className="min-h-[240px] bg-slate-50 border-slate-200 text-slate-900 rounded-xl resize-y text-base p-4 focus:border-blue-500 focus:ring-blue-500/20"
                                            required
                                        />
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !!success}
                                            className="bg-slate-900 hover:bg-slate-800 text-white h-14 px-8 rounded-xl font-bold text-base shadow-sm transition-all hover:shadow-md min-w-[180px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : success ? (
                                                <>
                                                    <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-400" />
                                                    Job Posted!
                                                </>
                                            ) : (
                                                "Publish Job"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* AI Info Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-indigo-50 rounded-[2rem] p-8 mt-8 lg:-mt-24 relative z-10 border border-indigo-100/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-lg text-indigo-900">AI Auto-Extraction</h3>
                            </div>

                            <p className="text-sm text-indigo-700/80 mb-6 leading-relaxed">
                                You don't need to manually tag skills. Our Gemini integration reads the context of your job description and automatically generates an accurate, standardized list of required skills.
                            </p>

                            {success && (
                                <div className="mt-6 p-5 bg-white border border-indigo-100 rounded-2xl animate-in slide-in-from-bottom-4 zoom-in-95 fade-in duration-500 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                                        Extracted Fingerprint
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {success.skills.map(s => (
                                            <span key={s} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400 mt-5 text-center flex items-center justify-center">
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                        Redirecting to dashboard...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
