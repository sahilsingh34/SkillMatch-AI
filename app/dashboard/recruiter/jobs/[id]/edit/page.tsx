"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateJobAction } from '../../actions'; // Reverted this line as the instruction's change would break the code.
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [jobData, setJobData] = useState<any>(null);

    useEffect(() => {
        async function fetchJob() {
            try {
                const response = await fetch(`/api/v1/jobs/${jobId}`);
                if (!response.ok) throw new Error("Failed to fetch job");
                const data = await response.json();
                setJobData(data);
            } catch (err) {
                setError("Could not load job details.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchJob();
    }, [jobId]);

    async function onSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        const result = await updateJobAction(jobId, formData);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else if (result.success) {
            setSuccess(true);
            setIsSubmitting(false);
            setTimeout(() => {
                router.push('/dashboard/recruiter');
                router.refresh();
            }, 2000);
        }
    }

    if (isLoading) {
        return (
            <div className="container max-w-4xl mx-auto py-20 px-4 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!jobData && error) {
        return (
            <div className="container max-w-4xl mx-auto py-20 px-4 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Link href="/dashboard/recruiter">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4 mt-16 md:mt-24">
            <Link href="/dashboard/recruiter" className="text-sm text-slate-400 hover:text-white flex items-center mb-6 w-fit transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Edit Job Posting</h1>
                <p className="text-slate-400">Update the details for "{jobData?.title}". AI will re-analyze skills if the description changes.</p>
            </div>

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
                                    <Label htmlFor="title" className="text-slate-300">Job Title</Label>
                                    <Input id="title" name="title" defaultValue={jobData?.title} required className="bg-slate-950 border-slate-800 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-slate-300">Company / Team</Label>
                                    <Input id="company" name="company" defaultValue={jobData?.company} required className="bg-slate-950 border-slate-800 text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-slate-300">Location</Label>
                                    <Input id="location" name="location" defaultValue={jobData?.location} className="bg-slate-950 border-slate-800 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-slate-300">Job Type</Label>
                                    <Input id="type" name="type" defaultValue={jobData?.type} className="bg-slate-950 border-slate-800 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary" className="text-slate-300">Salary Range</Label>
                                    <Input id="salary" name="salary" defaultValue={jobData?.salary} className="bg-slate-950 border-slate-800 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="description" className="text-slate-300">Job Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={jobData?.description}
                                    className="min-h-[200px] bg-slate-950 border-slate-800 text-white resize-y"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex justify-end gap-4">
                        <Link href="/dashboard/recruiter">
                            <Button variant="ghost" type="button" className="text-slate-400 hover:text-white">Cancel</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting || success}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Updated!
                                </>
                            ) : (
                                "Update Changes"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
