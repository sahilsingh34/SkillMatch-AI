import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MessageSquare, ChevronDown } from "lucide-react";

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
    <header className="fixed top-0 z-[100] w-full mt-4 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl h-16 flex items-center justify-between px-2 bg-transparent">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-9 px-4 bg-[#0f172a] rounded-full flex items-center justify-center transition-transform duration-300 shadow-sm border border-slate-800">
            <span className="text-white font-mono font-bold text-[17px] tracking-tight mt-[1px]">
              {"</>"}
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 ml-1">
            SkillMatch
          </span>
        </Link>

        {/* Center: Pill Navigation */}
        <nav className="hidden md:flex items-center bg-[#f3f4f6] rounded-full p-1 border border-black/[0.04] shadow-sm">
          <Link
            href="/"
            className="px-6 py-2 rounded-full text-[14px] font-semibold text-slate-900 bg-[#e5e7eb] transition-colors"
          >
            Home
          </Link>
          <Link
            href="#jobs"
            className="px-6 py-2 rounded-full text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-black/[0.03] transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="#companies"
            className="px-6 py-2 rounded-full text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-black/[0.03] transition-colors"
          >
            Companies
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">

          {/* Message Icon */}
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white shadow-sm">
            <MessageSquare className="h-4 w-4" />
          </button>

          {/* Language Selector */}
          <button className="h-10 px-3 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm text-sm font-semibold">
            EN <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
          </button>

          {/* Auth Actions */}
          <SignedIn>
            <div className="flex items-center space-x-3 ml-2">
              <Link href={userRole === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile"}>
                <Button variant="outline" className="h-10 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 shadow-sm rounded-xl px-5">
                  Dashboard
                </Button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonBox: "h-10 w-10 border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:scale-105 transition-transform"
                  }
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <Link href="/auth/login" className="ml-2">
              <Button className="bg-[#111827] hover:bg-black text-white rounded-xl px-7 h-10 text-[14px] font-bold shadow-md shadow-black/10">
                Login
              </Button>
            </Link>
          </SignedOut>
        </div>

      </div>
    </header>
  );
}

