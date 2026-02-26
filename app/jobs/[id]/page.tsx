import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Building, ChevronRight, Clock, DollarSign, Globe2, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ApplyNowButton } from "./ApplyNowButton";

// Helper for Mock Vector Matching
function calculateMatchScore(jobSkills: string, userSkills: string[]): number {
    if (!userSkills || userSkills.length === 0) return 0;

    const formattedJobSkills = jobSkills.split(',').map(s => s.trim().toLowerCase());
    const formattedUserSkills = userSkills.map(s => s.toLowerCase());

    const matches = formattedJobSkills.filter((skill: string) => formattedUserSkills.includes(skill));
    const score = Math.round((matches.length / formattedJobSkills.length) * 100);

    return Math.max(40, score + (formattedJobSkills.length < 3 ? 20 : 0));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
        notFound();
    }

    const { userId: clerkId } = await auth();
    let alreadyApplied = false;
    let matchScore = 0;

    if (clerkId) {
        // @ts-ignore
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (user) {
            const existingApp = await prisma.applicant.findFirst({
                where: { jobId: job.id, userId: user.id }
            });
            alreadyApplied = !!existingApp;

            if (user.profile?.skills) {
                const userSkills = user.profile.skills.split(',').map((s: string) => s.trim());
                matchScore = calculateMatchScore(job.skills, userSkills);
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-6">
                <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Job Info */}
                <div className="flex-1 space-y-8">
                    <div>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{job.title}</h1>
                                <div className="flex items-center text-xl text-muted-foreground">
                                    <Building className="mr-2 h-5 w-5" />
                                    {job.company}
                                </div>
                            </div>
                            {matchScore > 0 ? (
                                <Badge variant={matchScore > 80 ? "default" : "secondary"} className="gap-1 rounded-sm text-sm px-3 py-1 mt-2 md:mt-0 self-start">
                                    <Sparkles className="h-4 w-4" />
                                    {matchScore}% AI Match
                                </Badge>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm mt-6">
                            <div className="flex items-center font-medium bg-muted px-3 py-1.5 rounded-md">
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> {job.location}
                            </div>
                            <div className="flex items-center font-medium bg-muted px-3 py-1.5 rounded-md">
                                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" /> {job.type}
                            </div>
                            <div className="flex items-center font-medium bg-muted px-3 py-1.5 rounded-md">
                                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" /> {job.salary}
                            </div>
                            <div className="flex items-center font-medium bg-muted px-3 py-1.5 rounded-md">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" /> Posted {job.postedAt.toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">About the Role</h2>
                        <p className="text-muted-foreground">
                            We are looking for a passionate <strong>{job.title}</strong> to join our dynamic team at <strong>{job.company}</strong>. In this role, you will be responsible for building high-quality, scalable applications and working closely with cross-functional teams to deliver excellent user experiences.
                        </p>
                        <h3 className="text-xl font-medium mt-6 mb-3">Key Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Design, develop, and maintain software features based on project requirements.</li>
                            <li>Collaborate with product managers, designers, and other engineers.</li>
                            <li>Participate in code reviews and ensure high standards of code quality.</li>
                            <li>Optimize applications for maximum speed and scalability.</li>
                        </ul>
                        <h3 className="text-xl font-medium mt-6 mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.split(',').map(skill => (
                                <Badge key={skill.trim()} variant="outline" className="text-sm">
                                    {skill.trim()}
                                </Badge>
                            ))}
                            <Badge variant="outline" className="text-sm border-dashed">
                                + Agile Methodologies
                            </Badge>
                            <Badge variant="outline" className="text-sm border-dashed">
                                + Problem Solving
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 space-y-6 shrink-0 lg:sticky lg:top-24 h-fit">
                    <Card>
                        <CardContent className="p-6">
                            <ApplyNowButton jobId={job.id} alreadyApplied={alreadyApplied} />
                            <Button variant="outline" className="w-full mb-6">Save Job</Button>

                            <div className="pt-4 border-t space-y-4 text-sm text-muted-foreground">
                                <div className="flex justify-between items-center tracking-tight">
                                    <span className="font-medium text-foreground">Job ID</span>
                                    <span className="font-mono">{job.id.slice(-5).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center tracking-tight">
                                    <span className="font-medium text-foreground">Applicants</span>
                                    <span>2</span>
                                </div>
                                <div className="flex justify-between items-center tracking-tight">
                                    <span className="font-medium text-foreground">Posted</span>
                                    <span>{job.postedAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center font-bold text-xl text-primary">
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{job.company}</h3>
                                    <Link href="#" className="text-sm text-primary hover:underline flex items-center">
                                        View Company <ChevronRight className="h-3 w-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                A leading technology company focused on delivering innovative solutions to complex problems.
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Globe2 className="h-4 w-4 mr-2" />
                                <Link href="#" className="hover:underline hover:text-primary transition-colors">
                                    {job.company.toLowerCase().replace(" ", "")}.com
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
