import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, MapPin, DollarSign, Clock, Search, SlidersHorizontal, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { Job } from '@prisma/client';
import { auth } from "@clerk/nextjs/server";

// Helper for Mock Vector Matching
function calculateMatchScore(jobSkills: string, userSkills: string[]): number {
    if (!userSkills || userSkills.length === 0) return Math.floor(Math.random() * 30) + 60; // Random baseline if no skills

    const formattedJobSkills = jobSkills.split(',').map(s => s.trim().toLowerCase());
    const formattedUserSkills = userSkills.map(s => s.toLowerCase());

    const matches = formattedJobSkills.filter((skill: string) => formattedUserSkills.includes(skill));
    const score = Math.round((matches.length / formattedJobSkills.length) * 100);

    // Guarantee a minimum score for UI demo purposes, scale up based on matches
    return Math.max(40, score + (formattedJobSkills.length < 3 ? 20 : 0));
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ skills?: string }> }) {
    const params = await searchParams;
    const userSkillsParam = params.skills;
    let userSkills = userSkillsParam ? userSkillsParam.split(',') : [];

    const { userId } = await auth();
    if (userId && userSkills.length === 0) {
        try {
            // @ts-ignore
            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
                include: { profile: true } as any
            }) as any;

            if (user?.profile?.skills) {
                userSkills = user.profile.skills.split(',').map((s: string) => s.trim());
            }
        } catch (e) {
            console.error("Jobs: failed to fetch user profile skills", e);
        }
    }

    // Fetch ALL jobs from the real database
    let dbJobs: Job[] = [];
    try {
        dbJobs = await prisma.job.findMany();
    } catch (e) {
        console.error("Jobs: failed to fetch jobs from DB", e);
    }

    // Sort and score jobs dynamically if skills are passed
    const displayJobs = dbJobs.map((job: Job) => {
        return {
            ...job,
            matchScore: userSkills.length > 0 ? calculateMatchScore(job.skills, userSkills) : 0
        };
    }).sort((a: any, b: any) => b.matchScore - a.matchScore); // Highest match first
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find Your Next Role</h1>
                    <p className="text-muted-foreground mt-1">Discover opportunities matched to your unique skills.</p>
                </div>
                <div className="flex w-full md:w-auto max-w-sm items-center space-x-2">
                    <Input type="text" placeholder="Search by title, skill, or company..." className="w-full md:w-80" />
                    <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 space-y-6 shrink-0 md:sticky md:top-24 h-fit">
                    <div className="flex items-center space-x-2 pb-4 border-b">
                        <SlidersHorizontal className="h-5 w-5" />
                        <h2 className="font-semibold text-lg">Filters</h2>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-sm">Job Type</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="full-time" />
                                <label htmlFor="full-time" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Full-time
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="contract" />
                                <label htmlFor="contract" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Contract
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="part-time" />
                                <label htmlFor="part-time" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Part-time
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-sm">Location</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remote" />
                                <label htmlFor="remote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Remote Only
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="onsite" />
                                <label htmlFor="onsite" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    On-site
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="hybrid" />
                                <label htmlFor="hybrid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hybrid
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Listings list */}
                <div className="flex-1 space-y-4">
                    {displayJobs.map((job) => (
                        <Card key={job.id} className="transition-all hover:shadow-md hover:border-primary/20 group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link href={`/jobs/${job.id}`} className="hover:underline">
                                                    <h2 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
                                                        {job.title}
                                                    </h2>
                                                </Link>
                                                <p className="text-muted-foreground">{job.company}</p>
                                            </div>
                                            <div className="md:hidden">
                                                <Badge variant={job.matchScore > 90 ? "default" : "secondary"} className="gap-1 rounded-sm">
                                                    <Sparkles className="h-3 w-3" />
                                                    {job.matchScore}% Match
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground pt-2">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> {job.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" /> {job.type}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" /> {job.salary}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" /> {job.postedAt.toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-4">
                                            {job.skills.split(',').map((skill: string) => (
                                                <Badge key={skill.trim()} variant="outline" className="bg-background">
                                                    {skill.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between shrink-0">
                                        <div className="hidden md:block">
                                            <Badge variant={job.matchScore > 90 ? "default" : "secondary"} className="gap-1 rounded-sm">
                                                <Sparkles className="h-3 w-3" />
                                                {job.matchScore}% Match
                                            </Badge>
                                        </div>
                                        <Link href={`/jobs/${job.id}`}>
                                            <Button className="w-full md:w-auto mt-4 md:mt-0">Apply Now</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
