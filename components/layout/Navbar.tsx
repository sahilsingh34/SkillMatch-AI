import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MessageSquare, ChevronDown } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export async function Navbar() {
  const { userId } = await auth();
  let userRole = null;

  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      });
      userRole = user?.role ?? null;
    } catch (e) {
      console.error("Navbar: failed to fetch user role", e);
    }
  }

  return (
    <header className="fixed top-0 z-[100] w-full border-b border-slate-200/50 dark:border-neutral-800/50 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto max-w-6xl h-16 flex items-center justify-between px-4 sm:px-6">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-9 px-4 bg-[#0f172a] rounded-full flex items-center justify-center transition-transform duration-300 shadow-sm border border-slate-800">
            <span className="text-white font-mono font-bold text-[17px] tracking-tight mt-[1px]">
              {"</>"}
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white ml-1">
            SkillMatch
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
            Home
          </Link>

          {userRole === "SEEKER" && (
            <>
              <Link href="/jobs" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
                Find Jobs
              </Link>
              <Link href="/dashboard/profile/applications" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
                My Applications
              </Link>
            </>
          )}

          {userRole === "RECRUITER" && (
            <>
              <Link href="/dashboard/recruiter/post-job" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
                Post a Job
              </Link>
              <Link href="/dashboard/recruiter" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
                My Listings
              </Link>
            </>
          )}

          {!userRole && (
            <>
              <Link href="/jobs" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
                Jobs
              </Link>
              <Link href="#companies" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-sm transition-all duration-200">
                Companies
              </Link>
            </>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1 sm:space-x-3">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Actions */}
          <SignedIn>
            <div className="flex items-center space-x-2 sm:space-x-3 ml-1 sm:ml-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9 sm:h-10 sm:w-10 hover:scale-105 transition-transform"
                  }
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <Link href="/auth/login" className="ml-1 sm:ml-2">
              <Button className="bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-xl px-4 sm:px-7 h-9 sm:h-10 text-[13px] sm:text-[14px] font-bold shadow-md shadow-black/10">
                Login
              </Button>
            </Link>
          </SignedOut>

          {/* Mobile Menu Toggle */}
          <MobileMenu userRole={userRole} />
        </div>

      </div>
    </header>
  );
}

