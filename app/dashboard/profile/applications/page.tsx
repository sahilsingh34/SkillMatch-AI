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

    if (!user?.role) {
        redirect("/onboarding");
    }

    if (user.role !== "SEEKER") {
        redirect("/dashboard/recruiter");
    }

    const applications = user.applications;

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-white border-b border-slate-100 flex items-end pt-24 pb-8 min-h-[160px]">
                <div className="container max-w-5xl mx-auto px-4 lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                        My Applications
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Track the status of your submitted job applications.
                    </p>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto px-4 lg:px-8 py-10">
                {applications.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-[2rem] shadow-sm">
                        <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                            <Inbox className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">No applications yet</h3>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                            You haven't applied to any roles yet. Complete your profile and start discovering matches!
                        </p>
                        <Link href="/jobs" className="inline-flex items-center justify-center rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 shadow-sm transition-transform active:scale-95">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <Card key={app.id} className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                                        {/* Job Details */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Link href={`/jobs/${app.job.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                                        {app.job.title}
                                                    </Link>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mt-3">
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-md border border-slate-100">
                                                            <Building2 className="h-4 w-4 text-slate-400" />
                                                            {app.job.company}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-md border border-slate-100">
                                                            <MapPin className="h-4 w-4 text-slate-400" />
                                                            {app.job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-md border border-slate-100">
                                                            <Briefcase className="h-4 w-4 text-slate-400" />
                                                            {app.job.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Application Meta */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-5 border-t border-slate-100 md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0">

                                            <div className="flex flex-col items-start md:items-end gap-2">
                                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Status</span>
                                                <Badge variant="outline" className={`
                                                    px-3 py-1 font-bold rounded-lg border-2
                                                    ${app.status === 'Applied' && 'border-slate-200 text-slate-600 bg-slate-50'}
                                                    ${app.status === 'Screening' && 'border-blue-200 text-blue-700 bg-blue-50'}
                                                    ${app.status === 'Interview' && 'border-indigo-200 text-indigo-700 bg-indigo-50'}
                                                    ${app.status === 'Offered' && 'border-emerald-200 text-emerald-700 bg-emerald-50'}
                                                    ${app.status === 'Rejected' && 'border-red-200 text-red-700 bg-red-50'}
                                                `}>
                                                    {app.status}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 mt-2">
                                                <div className="flex items-center gap-1.5 text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                                                    <Sparkles className="h-3.5 w-3.5" />
                                                    {app.matchScore}% Match
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                                                    <CalendarDays className="h-3.5 w-3.5" />
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
        </div>
    );
}
