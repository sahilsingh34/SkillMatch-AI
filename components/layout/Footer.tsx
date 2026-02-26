import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold tracking-tight text-primary">SkillMatch AI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground w-full max-w-sm">
                            Connecting top talent with leading companies through intelligent, AI-driven skill matching.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Candidates</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
                            <li><Link href="/dashboard/profile" className="hover:text-primary">Resume Builder</Link></li>
                            <li><Link href="/dashboard/profile/applications" className="hover:text-primary">My Applications</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/dashboard/recruiter/post-job" className="hover:text-primary">Post a Job</Link></li>
                            <li><Link href="/dashboard/recruiter" className="hover:text-primary">Manage Postings</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} SkillMatch AI. All rights reserved.
                    </p>
                    <div className="flex space-x-4 text-xs text-muted-foreground">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
