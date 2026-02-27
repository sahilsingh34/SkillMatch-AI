"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserRoundSearch, Briefcase } from "lucide-react";
import Link from "next/link";

export function LoginDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-xl px-4 sm:px-7 h-9 sm:h-10 text-[13px] sm:text-[14px] font-bold shadow-md shadow-black/10"
            >
                Login
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">I want to login as...</p>
                    </div>
                    <Link
                        href="/auth/login"
                        onClick={() => {
                            localStorage.setItem("preferred_role", "SEEKER");
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                    >
                        <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <UserRoundSearch className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-black dark:text-white">Job Seeker</p>
                            <p className="text-[11px] text-neutral-400">Find jobs matching your skills</p>
                        </div>
                    </Link>
                    <Link
                        href="/auth/login"
                        onClick={() => {
                            localStorage.setItem("preferred_role", "RECRUITER");
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border-t border-neutral-100 dark:border-neutral-800 group"
                    >
                        <div className="h-9 w-9 bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-black dark:text-white">Recruiter</p>
                            <p className="text-[11px] text-neutral-400">Post jobs & find talent</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
