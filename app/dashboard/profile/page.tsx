"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Inbox, Sparkles, TrendingUp, Target, Lightbulb, PlusCircle } from "lucide-react";
import Link from "next/link";

import { getJobSeekerProfileAction, getSkillGapAnalysisAction } from "./actions";

export default function ProfileDashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    // Skill Gap state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [skillGap, setSkillGap] = useState<any>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        if (acceptedFiles.length > 0) {
            const selected = acceptedFiles[0];
            if (selected.type === "application/pdf" || selected.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                setFile(selected);
            } else {
                setError("Please upload a PDF or DOCX file.");
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
    });

    const [skills, setSkills] = useState<string[]>([]);
    const [summary, setSummary] = useState<string>("");

    useEffect(() => {
        getJobSeekerProfileAction().then((result: any) => {
            if (result.profile) {
                const fetchedSkills = result.profile.skills ? result.profile.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.toLowerCase() !== "unable to extract") : [];
                setSkills(fetchedSkills);
                setSummary(`Profile successfully extracted and saved. Experience: ${result.profile.experience} years.`);
                setResumeUrl(result.profile.resumeUrl);
            }
            setIsLoadingProfile(false);
        }).catch(() => {
            setIsLoadingProfile(false);
        });
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError(null);
        setSkills([]);
        setSummary("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to read resume file");
            }

            const extractedSkills = data.skills ? data.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.toLowerCase() !== "unable to extract") : [];
            setSkills(extractedSkills);
            setSummary(data.message || "Resume processed successfully.");
            if (data.resumeUrl) setResumeUrl(data.resumeUrl);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSkillGapAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const result = await getSkillGapAnalysisAction();
            if (result.success && result.analysis) {
                setSkillGap(result.analysis);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pb-24 transition-colors">
            <div className="pt-28 pb-8 bg-muted/30 border-b border-border flex items-end">
                <div className="container max-w-5xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Your Profile</h1>
                            <p className="text-muted-foreground font-medium">Upload your resume to let our AI build your skill fingerprint.</p>
                        </div>
                        <Button variant="outline" className="shrink-0 border-border text-foreground hover:bg-muted font-bold h-11 px-6 rounded-xl shadow-sm transition-all" asChild>
                            <Link href="/dashboard/profile/applications">
                                <Inbox className="mr-2 h-4 w-4" />
                                My Applications
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto px-4 lg:px-8 py-10">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Column */}
                    <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold text-foreground tracking-tight">Resume Upload</CardTitle>
                            <CardDescription className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Drag and drop your resume (PDF/DOCX) here.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-foreground bg-muted/50 scale-[1.01]" : "border-border hover:border-foreground hover:bg-muted/30"
                                    }`}
                            >
                                <input {...getInputProps()} />

                                {!file ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border shadow-inner">
                                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-base font-bold text-foreground mb-1">Click to upload or drag and drop</p>
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">PDF or DOCX (max. 5MB)</p>
                                        {resumeUrl && (
                                            <p className="text-xs font-bold text-foreground mt-6 px-3 py-2 bg-muted rounded-lg border border-border flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Resume on file. Uploading a new one overrides it.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border shadow-inner">
                                            <FileText className="h-8 w-8 text-foreground" />
                                        </div>
                                        <p className="font-bold text-foreground text-sm truncate max-w-[200px] mb-1">{file.name}</p>
                                        <p className="text-xs font-bold text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-6 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-muted rounded-lg h-8 px-4"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                        >
                                            Remove File
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-6 flex items-center text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button
                                className="w-full mt-6 bg-foreground text-background hover:bg-foreground/90 font-bold h-12 rounded-xl shadow-md transition-all active:scale-[0.98]"
                                disabled={!file || isUploading}
                                onClick={handleUpload}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing Resume...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Extract Skills
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results / Status Column */}
                    <Card className="bg-muted/40 border border-border shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground tracking-tight">
                                <Sparkles className="w-5 h-5 text-foreground" />
                                Your AI Fingerprint
                            </CardTitle>
                            <CardDescription className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Extracted skills will appear here.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            {isLoadingProfile ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-5">
                                    <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin"></div>
                                    <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">LOADING PROFILE DATA...</p>
                                </div>
                            ) : skills.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6">
                                    <div className="h-20 w-20 rounded-full bg-card shadow-sm border border-border flex items-center justify-center">
                                        <Lightbulb className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-bold text-muted-foreground px-6 leading-relaxed">
                                        Upload a resume to generate your unique skill profile and unlock personalized job matches.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="p-5 bg-card rounded-2xl border border-border shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-foreground"></div>
                                        <h4 className="font-bold text-[10px] uppercase tracking-widest mb-3 text-muted-foreground flex items-center">
                                            <Sparkles className="w-3.5 h-3.5 mr-2 text-foreground" />
                                            AI Summary
                                        </h4>
                                        <p className="text-sm font-bold text-foreground leading-relaxed">{summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[10px] uppercase tracking-widest mb-4 text-muted-foreground">Extracted Skills</h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {skills.map((skill) => (
                                                <div key={skill} className="px-3 py-1.5 bg-card border border-border shadow-sm text-foreground text-[11px] font-bold rounded-full uppercase tracking-wider">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                                        <Button className="flex-1 bg-card border border-border text-foreground hover:bg-muted font-bold h-12 rounded-xl shadow-sm transition-all" asChild>
                                            <a href={`/jobs?skills=${encodeURIComponent(skills.join(','))}`}>View Matches</a>
                                        </Button>
                                        <Button
                                            className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-bold h-12 rounded-xl shadow-sm transition-all"
                                            onClick={handleSkillGapAnalysis}
                                            disabled={isAnalyzing}
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Target className="mr-2 h-4 w-4" />
                                                    Gap Analysis
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>

                {/* Skill Gap Analysis Results */}
                {skillGap && (
                    <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 border-t border-border pt-16">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
                                <Sparkles className="h-8 w-8 text-foreground" />
                                AI Career Analysis
                            </h2>
                            <p className="text-muted-foreground font-bold mt-3 max-w-2xl mx-auto uppercase tracking-widest text-xs">Based on real-time market data matching your extracted skill fingerprint.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Profile Strength */}
                            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <CardContent className="p-8 flex items-center justify-center flex-col h-full relative">
                                    <div className="text-center">
                                        <div className="relative inline-flex items-center justify-center w-36 h-36 mb-6">
                                            <svg className="w-36 h-36 -rotate-90 drop-shadow-sm" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted border-none" />
                                                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="6" fill="none"
                                                    className="text-foreground"
                                                    strokeDasharray={`${(skillGap.profileStrength / 100) * 339.3} 339.3`}
                                                    strokeLinecap="round"
                                                    style={{ transition: "stroke-dasharray 1.5s ease-out" }}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-bold text-foreground tracking-tighter">{skillGap.profileStrength}%</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">MATCH</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Profile Strength</p>
                                        <p className="text-[10px] font-bold text-foreground uppercase tracking-wider">Based on {skillGap.totalJobs} live jobs</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary + Strong Skills */}
                            <Card className="md:col-span-2 bg-card border border-border shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 border border-border">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Market Insight</h4>
                                            <p className="text-foreground font-bold leading-relaxed">{skillGap.summary}</p>
                                        </div>
                                    </div>

                                    {skillGap.strongSkills.length > 0 && (
                                        <div className="flex items-start gap-4 pt-6 border-t border-border">
                                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0 border border-border">
                                                <CheckCircle2 className="h-5 w-5 text-foreground" />
                                            </div>
                                            <div className="w-full">
                                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Your Strengths</h4>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {skillGap.strongSkills.map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-card border border-border text-foreground shadow-sm text-[11px] font-bold rounded-full uppercase tracking-wider">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Missing Skills + Suggestions */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Missing Skills */}
                            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <div className="h-1 bg-foreground"></div>
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-foreground tracking-tight">
                                        <div className="p-2 bg-muted rounded-lg border border-border">
                                            <Target className="h-5 w-5 text-foreground" />
                                        </div>
                                        Skills to Learn
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest leading-relaxed">High-demand skills missing from your profile</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-2">
                                    <div className="flex flex-wrap gap-2.5">
                                        {skillGap.missingSkills.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1.5 bg-muted/50 text-foreground border border-border text-[11px] font-bold rounded-full flex items-center uppercase tracking-wider">
                                                <PlusCircle className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Suggestions */}
                            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <div className="h-1 bg-foreground opacity-50"></div>
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-foreground tracking-tight">
                                        <div className="p-2 bg-muted rounded-lg border border-border">
                                            <Lightbulb className="h-5 w-5 text-foreground" />
                                        </div>
                                        Strategy
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest leading-relaxed">Targeted recommendations for your next steps</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <ul className="space-y-4">
                                        {skillGap.suggestions.map((suggestion: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4 text-sm font-bold text-foreground bg-muted/50 p-4 rounded-2xl border border-border transition-all hover:translate-x-1">
                                                <div className="flex bg-foreground text-background font-black items-center justify-center rounded-full w-8 h-8 shrink-0 text-xs shadow-sm">
                                                    {i + 1}
                                                </div>
                                                <p className="mt-1 leading-relaxed">{suggestion}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
