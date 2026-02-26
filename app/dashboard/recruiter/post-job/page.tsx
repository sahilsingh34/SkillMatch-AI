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
        <div className="container max-w-4xl mx-auto py-10 px-4 mt-16 lg:mt-24">
            <Link href="/dashboard/recruiter" className="text-sm text-slate-400 hover:text-white flex items-center mb-6 w-fit transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Post a New Job</h1>
                <p className="text-slate-400">Fill out the role details. Our AI will automatically extract the required core skills from your description.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="md:col-span-2">
                    <form action={onSubmit}>
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="p-6 space-y-6">

                                {error && (
                                    <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-slate-300">Job Title <span className="text-red-400">*</span></Label>
                                            <Input id="title" name="title" placeholder="e.g. Senior Frontend Engineer" required className="bg-slate-950 border-slate-800 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="text-slate-300">Company / Team <span className="text-red-400">*</span></Label>
                                            <Input id="company" name="company" placeholder="e.g. TechNova" required className="bg-slate-950 border-slate-800 text-white" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-slate-300">Location</Label>
                                            <Input id="location" name="location" placeholder="e.g. Remote, NY" defaultValue="Remote" className="bg-slate-950 border-slate-800 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="text-slate-300">Job Type</Label>
                                            <Input id="type" name="type" placeholder="e.g. Full-time" defaultValue="Full-time" className="bg-slate-950 border-slate-800 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="salary" className="text-slate-300">Salary Range</Label>
                                            <Input id="salary" name="salary" placeholder="e.g. $120k-$150k" className="bg-slate-950 border-slate-800 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="description" className="text-slate-300">Job Description <span className="text-red-400">*</span></Label>
                                        <p className="text-xs text-slate-500 mb-2">Aim for detail. Gemini AI will scan this to build the required skillset (AI Skill Fingerprint).</p>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe the role, responsibilities, and qualifications..."
                                            className="min-h-[200px] bg-slate-950 border-slate-800 text-white resize-y"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 border-t-0 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !!success}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : success ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Job Posted!
                                        </>
                                    ) : (
                                        "Publish Job"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                {/* AI Info Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-indigo-950/20 border-indigo-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-indigo-300">
                                <Sparkles className="mr-2 h-5 w-5" />
                                AI Auto-Extraction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-indigo-200/70 mb-4">
                                You don't need to manually tag skills. Our Gemini integration reads the context of your job description and automatically generates an accurate, standardized list of required skills.
                            </p>

                            {success && (
                                <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-lg animate-in slide-in-from-bottom-2 fade-in duration-300">
                                    <h4 className="text-sm font-semibold text-white mb-3">Extracted Skills Fingerprint:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {success.skills.map(s => (
                                            <span key={s} className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-md border border-indigo-500/20">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-4 text-center">Redirecting to dashboard...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
