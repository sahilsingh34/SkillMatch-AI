import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
      // If DB is unreachable, degrade gracefully — show both nav options
      console.error("Navbar: failed to fetch user role", e);
    }
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight text-primary">SkillMatch AI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {userRole !== "RECRUITER" && (
            <Link href="/jobs" className="transition-colors hover:text-foreground/80 text-foreground/60">Find Jobs</Link>
          )}
          <Link
            href={userRole === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile"}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dashboard
          </Link>
          {userRole === "SEEKER" && (
            <Link href="/dashboard/profile/saved" className="transition-colors hover:text-foreground/80 text-foreground/60">Saved Jobs</Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <div className="flex items-center space-x-4">
              {(!userRole || userRole === "SEEKER") && (
                <Link href="/dashboard/profile">
                  <Button variant="ghost" className="hidden sm:inline-flex text-indigo-400 hover:text-indigo-300">Seeker Profile</Button>
                </Link>
              )}
              {(!userRole || userRole === "RECRUITER") && (
                <Link href="/dashboard/recruiter">
                  <Button variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-950/30">Recruiter ATS</Button>
                </Link>
              )}
              <div className="ml-4 border-l border-slate-800 pl-4">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonBox: "h-9 w-9" } }} />
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
