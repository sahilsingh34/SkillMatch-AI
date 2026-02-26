"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Briefcase, MapPin, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import Link from 'next/link';
import { getSavedJobsAction } from '../../../jobs/saved-actions';
import { SaveJobButton } from '../../../jobs/SaveJobButton';

export default function SavedJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSavedJobs() {
            const result = await getSavedJobsAction();
            if (result.error) {
                setError(result.error);
            } else {
                setJobs(result.savedJobs || []);
            }
            setIsLoading(false);
        }
        fetchSavedJobs();
    }, []);

    if (isLoading) {
        return (
            <div className="container max-w-5xl mx-auto py-20 px-4 flex justify-center mt-16 lg:mt-24">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto py-10 px-4 mt-16 lg:mt-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Bookmark className="h-5 w-5 text-indigo-400 fill-current" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Saved Jobs</h1>
                    <p className="text-slate-400">Manage the positions you&apos;ve bookmarked for later.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                {jobs.map((job) => (
                    <Card key={job.id} className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all duration-300 backdrop-blur-sm group">
                        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                                        {job.type}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-400">
                                    <span className="flex items-center">
                                        <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                        {job.company}
                                    </span>
                                    <span className="flex items-center">
                                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center">
                                        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                                        {job.salary}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <SaveJobButton jobId={job.id} initialSaved={true} />
                                <Link href={`/jobs/${job.id}`} className="flex-1 md:flex-none">
                                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white group-hover:bg-indigo-600 transition-all">
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {jobs.length === 0 && !error && (
                    <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl border-dashed">
                        <Bookmark className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No saved jobs</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8">Browse the job board and bookmark roles that catch your eye.</p>
                        <Link href="/jobs">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                                Explore Jobs
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
