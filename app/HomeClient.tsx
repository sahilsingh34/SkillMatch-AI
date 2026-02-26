"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { assignUserRoleAction } from "./onboarding/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function HomeClient({ userRole }: { userRole: string | null | undefined }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleRoleSelection = async (role: "SEEKER" | "RECRUITER") => {
        setIsLoading(true);
        try {
            const result = await assignUserRoleAction(role);
            if (result.success && result.redirectTo) {
                toast({
                    title: "Welcome aboard! 🎉",
                    description: "Your " + (role === "SEEKER" ? "Job Seeker" : "Recruiter") + " profile is ready.",
                });
                router.push(result.redirectTo);
            } else {
                toast({ title: "Error", description: "Failed to set role. Please try again." });
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // --- HERO: Role Selection (for logged-in users with no role assigned yet) ---
    if (userRole === null) {
        return (
            <div className="flex flex-col min-h-screen">
                <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                            How do you want to use <span className="text-primary">SkillMatch AI</span>?
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12">
                            We&apos;ll customize your experience based on your choice.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                onClick={() => handleRoleSelection("SEEKER")}
                                disabled={isLoading}
                                className="relative group w-full p-8 rounded-3xl border-2 border-muted bg-card hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 disabled:opacity-50 cursor-pointer"
                            >
                                <div className="h-16 w-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <UserRoundSearch className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold">I&apos;m looking for a job</h3>
                                <p className="text-muted-foreground text-sm">
                                    Find top roles matching your verified skills. Let AI connect you with employers who value what you can do.
                                </p>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                onClick={() => handleRoleSelection("RECRUITER")}
                                disabled={isLoading}
                                className="relative group w-full p-8 rounded-3xl border-2 border-muted bg-card hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 disabled:opacity-50 cursor-pointer"
                            >
                                <div className="h-16 w-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Briefcase className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold">I&apos;m hiring talent</h3>
                                <p className="text-muted-foreground text-sm">
                                    Post jobs, discover highly matched candidates, and manage your pipeline efficiently with AI.
                                </p>
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>
        );
    }

    // --- HERO: Standard landing page (for logged-out visitors or users with a role) ---
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-5xl mx-auto overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground mb-6"
                >
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 mt-12"
                >
                    Find the perfect fit, <br className="hidden sm:inline" />
                    <span className="text-primary">intelligently.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                >
                    We use advanced AI to connect top talent with companies based on real skills, not just keywords. Say goodbye to the resume black hole.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    {userRole !== "RECRUITER" && (
                        <Link href="/jobs" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto text-base">
                                Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {userRole !== "SEEKER" && (
                        <Link href="/dashboard/recruiter/post-job" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                                Post a Job
                            </Button>
                        </Link>
                    )}
                </motion.div>
            </section>

            {/* Simplified Demo / Feature Section */}
            <section className="bg-muted/50 py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold mb-12"
                    >
                        How SkillMatch AI Works
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto font-medium">
                        <div className="p-6 rounded-2xl bg-card border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <span className="text-xl font-bold text-primary">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Build Profile</h3>
                            <p className="text-muted-foreground text-sm">Upload your resume and let our AI extract your verified skills.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <span className="text-xl font-bold text-primary">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Analyzes</h3>
                            <p className="text-muted-foreground text-sm">Our vector database matches your unique skill fingerprint with jobs.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border shadow-sm relative overflow-hidden">
                            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <span className="text-xl font-bold text-primary-foreground">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                            <p className="text-muted-foreground text-sm">Discover high-percentage matches and apply with one click.</p>
                            <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-50 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
