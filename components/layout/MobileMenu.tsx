"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileMenu({ userRole }: { userRole: string | null }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden ml-2">
            <button
                onClick={toggleMenu}
                className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-4 flex flex-col space-y-4 z-50">
                    <Link
                        href="/"
                        onClick={toggleMenu}
                        className="text-lg font-semibold text-slate-900 border-b border-slate-50 pb-2"
                    >
                        Home
                    </Link>

                    {userRole === "SEEKER" && (
                        <>
                            <Link href="/jobs" onClick={toggleMenu} className="text-lg font-semibold text-slate-600 hover:text-slate-900 border-b border-slate-50 pb-2">
                                Find Jobs
                            </Link>
                            <Link href="/dashboard/profile/applications" onClick={toggleMenu} className="text-lg font-semibold text-slate-600 hover:text-slate-900 border-b border-slate-50 pb-2">
                                My Applications
                            </Link>
                            <Link href="/dashboard/profile" onClick={toggleMenu} className="text-lg font-semibold text-blue-600 hover:text-blue-700 pt-2">
                                Dashboard
                            </Link>
                        </>
                    )}

                    {userRole === "RECRUITER" && (
                        <>
                            <Link href="/dashboard/recruiter/post-job" onClick={toggleMenu} className="text-lg font-semibold text-slate-600 hover:text-slate-900 border-b border-slate-50 pb-2">
                                Post a Job
                            </Link>
                            <Link href="/dashboard/recruiter" onClick={toggleMenu} className="text-lg font-semibold text-slate-600 hover:text-slate-900 border-b border-slate-50 pb-2">
                                My Listings
                            </Link>
                            <Link href="/dashboard/recruiter" onClick={toggleMenu} className="text-lg font-semibold text-indigo-600 hover:text-indigo-700 pt-2">
                                Dashboard
                            </Link>
                        </>
                    )}

                    {!userRole && (
                        <>
                            <Link href="/jobs" onClick={toggleMenu} className="text-lg font-semibold text-slate-600 hover:text-slate-900 border-b border-slate-50 pb-2">
                                Jobs
                            </Link>
                            <Link href="#companies" onClick={toggleMenu} className="text-lg font-semibold text-slate-600 hover:text-slate-900 border-b border-slate-50 pb-2">
                                Companies
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
