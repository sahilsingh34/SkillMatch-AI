import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, MapPin, Briefcase, CalendarDays, Inbox } from "lucide-react";
import Link from 'next/link';

export default async function MyApplicationsPage() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        redirect("/auth/login");
    }

    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: {
            applications: {
                include: {
                    job: true
                },
                orderBy: { appliedAt: 'desc' }
            }
        }
    });

    if (!user || user.role !== "SEEKER") {
        redirect("/dashboard/recruiter");
    }

    const applications = user.applications;

    return (
        <div className="container max-w-5xl mx-auto py-10 px-4 mt-16 lg:mt-24">
            <div className="mb-10 pb-6 border-b border-slate-800">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    My Applications
                </h1>
                <p className="text-slate-400">
                    Track the status of your submitted job applications.
                </p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-xl border-dashed">
                    <Inbox className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No applications yet</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        You haven't applied to any roles yet. Complete your profile and start discovering matches!
                    </p>
                    <Link href="/jobs" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-primary-foreground hover:bg-indigo-600/90 h-10 px-4 py-2">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    {/* Job Details */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link href={`/jobs/${app.job.id}`} className="text-xl font-semibold text-white hover:text-indigo-400 transition-colors">
                                                    {app.job.title}
                                                </Link>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-3.5 w-3.5" />
                                                        {app.job.company}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {app.job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="h-3.5 w-3.5" />
                                                        {app.job.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Application Meta */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t border-slate-800 md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">

                                        <div className="flex flex-col items-start md:items-end gap-1">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</span>
                                            <Badge variant="outline" className={`
                                                px-3 py-1 bg-slate-900
                                                ${app.status === 'Applied' && 'border-slate-600 text-slate-300'}
                                                ${app.status === 'Screening' && 'border-blue-500/50 text-blue-400'}
                                                ${app.status === 'Interview' && 'border-indigo-500/50 text-indigo-400'}
                                                ${app.status === 'Offered' && 'border-green-500/50 text-green-400'}
                                                ${app.status === 'Rejected' && 'border-red-500/50 text-red-500'}
                                            `}>
                                                {app.status}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-sm font-semibold text-indigo-400">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                {app.matchScore}% Match
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <CalendarDays className="h-3 w-3" />
                                                Applied {app.appliedAt.toLocaleDateString()}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
