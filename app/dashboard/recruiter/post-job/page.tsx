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
        <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 transition-colors">
            <div className="h-40 bg-neutral-50/50 dark:bg-neutral-900/20 border-b border-neutral-200 dark:border-neutral-800 flex items-end pb-8">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <Link href="/dashboard/recruiter" className="inline-flex items-center text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 max-w-6xl -mt-4">
                <div className="mb-10 pt-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">Post a New Job</h1>
                    <p className="text-[17px] text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">Fill out the role details. Our AI will automatically extract the required core skills from your description.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Form Column */}
                    <div className="md:col-span-2">
                        <form action={onSubmit}>
                            <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-8 shadow-sm">
                                {error && (
                                    <div className="p-4 mb-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white text-sm font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-black dark:text-white font-bold">Job Title *</Label>
                                            <Input id="title" name="title" placeholder="e.g. Senior Frontend Engineer" required className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-12 rounded-xl focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-neutral-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="text-black dark:text-white font-bold">Company / Team *</Label>
                                            <Input id="company" name="company" placeholder="e.g. TechNova" required className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-12 rounded-xl focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-neutral-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-black dark:text-white font-bold">Location</Label>
                                            <Input id="location" name="location" placeholder="e.g. Remote" defaultValue="Remote" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-12 rounded-xl focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-neutral-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="text-black dark:text-white font-bold">Job Type</Label>
                                            <Input id="type" name="type" placeholder="e.g. Full-time" defaultValue="Full-time" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-12 rounded-xl focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-neutral-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="salary" className="text-black dark:text-white font-bold">Salary Range</Label>
                                            <Input id="salary" name="salary" placeholder="e.g. $120k-$150k" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-12 rounded-xl focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-neutral-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label htmlFor="description" className="text-black dark:text-white font-bold">Job Description *</Label>
                                            <span className="text-[11px] font-bold text-black dark:text-white flex items-center bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full uppercase tracking-widest border border-neutral-200 dark:border-neutral-700">
                                                <Sparkles className="w-3 h-3 mr-1.5" /> AI Scanned
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 font-medium">Aim for detail. Gemini AI will scan this to build the required skillset (AI Skill Fingerprint).</p>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe the role, responsibilities, and qualifications..."
                                            className="min-h-[240px] bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-black dark:text-white rounded-xl resize-y text-base p-4 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !!success}
                                            className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 h-14 px-8 rounded-xl font-bold text-[15px] shadow-sm transition-all hover:shadow-md min-w-[180px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : success ? (
                                                <>
                                                    <CheckCircle2 className="mr-2 h-5 w-5" />
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
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-[2rem] p-8 mt-8 lg:-mt-24 relative z-10 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white dark:text-black" />
                                </div>
                                <h3 className="font-bold text-lg text-black dark:text-white tracking-tight">AI Auto-Extraction</h3>
                            </div>

                            <p className="text-[15px] font-medium text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                                You don't need to manually tag skills. Our Gemini integration reads the context of your job description and automatically generates an accurate, standardized list of required skills.
                            </p>

                            {success && (
                                <div className="mt-6 p-5 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl animate-in slide-in-from-bottom-4 zoom-in-95 fade-in duration-500 shadow-sm">
                                    <h4 className="text-sm font-bold text-black dark:text-white mb-3 flex items-center">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white mr-2" />
                                        Extracted Fingerprint
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {success.skills.map(s => (
                                            <span key={s} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white text-[11px] uppercase tracking-wider font-bold rounded-full border border-neutral-200 dark:border-neutral-700">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mt-5 text-center flex items-center justify-center uppercase tracking-widest">
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
