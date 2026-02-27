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
                setSkills(result.profile.skills ? result.profile.skills.split(',').map((s: string) => s.trim()) : []);
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

            setSkills(data.skills ? data.skills.split(',').map((s: string) => s.trim()) : []);
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
        <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 transition-colors">
            <div className="pt-28 pb-8 bg-neutral-50/50 dark:bg-neutral-900/20 border-b border-neutral-200 dark:border-neutral-800 flex items-end">
                <div className="container max-w-5xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-2">Your Profile</h1>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium">Upload your resume to let our AI build your skill fingerprint.</p>
                        </div>
                        <Button variant="outline" className="shrink-0 border-neutral-200 dark:border-neutral-800 text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold h-11 px-6 rounded-xl shadow-sm transition-all" asChild>
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
                    <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold text-black dark:text-white tracking-tight">Resume Upload</CardTitle>
                            <CardDescription className="text-sm font-bold text-neutral-500 mt-1 uppercase tracking-wider">Drag and drop your resume (PDF/DOCX) here.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-900/50 scale-[1.01]" : "border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                                    }`}
                            >
                                <input {...getInputProps()} />

                                {!file ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-800 shadow-inner">
                                            <UploadCloud className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
                                        </div>
                                        <p className="text-base font-bold text-black dark:text-white mb-1">Click to upload or drag and drop</p>
                                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">PDF or DOCX (max. 5MB)</p>
                                        {resumeUrl && (
                                            <p className="text-xs font-bold text-black dark:text-white mt-6 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Resume on file. Uploading a new one overrides it.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-800 shadow-inner">
                                            <FileText className="h-8 w-8 text-black dark:text-white" />
                                        </div>
                                        <p className="font-bold text-black dark:text-white text-sm truncate max-w-[200px] mb-1">{file.name}</p>
                                        <p className="text-xs font-bold text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-6 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg h-8 px-4"
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
                                className="w-full mt-6 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold h-12 rounded-xl shadow-md transition-all active:scale-[0.98]"
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
                    <Card className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-black dark:text-white tracking-tight">
                                <Sparkles className="w-5 h-5 text-black dark:text-white" />
                                Your AI Fingerprint
                            </CardTitle>
                            <CardDescription className="text-sm font-bold text-neutral-500 mt-1 uppercase tracking-wider">Extracted skills will appear here.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            {isLoadingProfile ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-5">
                                    <div className="w-16 h-16 border-4 border-neutral-200 dark:border-neutral-800 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                                    <p className="text-xs font-bold text-neutral-500 tracking-widest uppercase">LOADING PROFILE DATA...</p>
                                </div>
                            ) : skills.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6">
                                    <div className="h-20 w-20 rounded-full bg-white dark:bg-[#0a0a0a] shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                                        <Lightbulb className="h-8 w-8 text-neutral-300 dark:text-neutral-700" />
                                    </div>
                                    <p className="text-sm font-bold text-neutral-500 px-6 leading-relaxed">
                                        Upload a resume to generate your unique skill profile and unlock personalized job matches.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="p-5 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-black dark:bg-white"></div>
                                        <h4 className="font-bold text-[10px] uppercase tracking-widest mb-3 text-neutral-400 flex items-center">
                                            <Sparkles className="w-3.5 h-3.5 mr-2 text-black dark:text-white" />
                                            AI Summary
                                        </h4>
                                        <p className="text-sm font-bold text-black dark:text-white leading-relaxed">{summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[10px] uppercase tracking-widest mb-4 text-neutral-400">Extracted Skills</h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {skills.map((skill) => (
                                                <div key={skill} className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-black dark:text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                                        <Button className="flex-1 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold h-12 rounded-xl shadow-sm transition-all" asChild>
                                            <a href={`/jobs?skills=${encodeURIComponent(skills.join(','))}`}>View Matches</a>
                                        </Button>
                                        <Button
                                            className="flex-1 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold h-12 rounded-xl shadow-sm transition-all"
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
                    <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 border-t border-neutral-200 dark:border-neutral-800 pt-16">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white flex items-center justify-center gap-3">
                                <Sparkles className="h-8 w-8 text-black dark:text-white" />
                                AI Career Analysis
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 font-bold mt-3 max-w-2xl mx-auto uppercase tracking-widest text-xs">Based on real-time market data matching your extracted skill fingerprint.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Profile Strength */}
                            <Card className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <CardContent className="p-8 flex items-center justify-center flex-col h-full relative">
                                    <div className="text-center">
                                        <div className="relative inline-flex items-center justify-center w-36 h-36 mb-6">
                                            <svg className="w-36 h-36 -rotate-90 drop-shadow-sm" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="6" fill="none" className="text-neutral-100 dark:text-neutral-800" />
                                                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="6" fill="none"
                                                    className="text-black dark:text-white"
                                                    strokeDasharray={`${(skillGap.profileStrength / 100) * 339.3} 339.3`}
                                                    strokeLinecap="round"
                                                    style={{ transition: "stroke-dasharray 1.5s ease-out" }}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-bold text-black dark:text-white tracking-tighter">{skillGap.profileStrength}%</span>
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">MATCH</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Profile Strength</p>
                                        <p className="text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">Based on {skillGap.totalJobs} live jobs</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary + Strong Skills */}
                            <Card className="md:col-span-2 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
                                            <TrendingUp className="h-5 w-5 text-white dark:text-black" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Market Insight</h4>
                                            <p className="text-black dark:text-white font-bold leading-relaxed">{skillGap.summary}</p>
                                        </div>
                                    </div>

                                    {skillGap.strongSkills.length > 0 && (
                                        <div className="flex items-start gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                                            <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
                                                <CheckCircle2 className="h-5 w-5 text-black dark:text-white" />
                                            </div>
                                            <div className="w-full">
                                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Your Strengths</h4>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {skillGap.strongSkills.map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white shadow-sm text-[11px] font-bold rounded-full uppercase tracking-wider">
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
                            <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <div className="h-1 bg-black dark:bg-white"></div>
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-black dark:text-white tracking-tight">
                                        <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                                            <Target className="h-5 w-5 text-black dark:text-white" />
                                        </div>
                                        Skills to Learn
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-neutral-500 mt-2 uppercase tracking-widest leading-relaxed">High-demand skills missing from your profile</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-2">
                                    <div className="flex flex-wrap gap-2.5">
                                        {skillGap.missingSkills.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900/50 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 text-[11px] font-bold rounded-full flex items-center uppercase tracking-wider">
                                                <PlusCircle className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Suggestions */}
                            <Card className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                                <div className="h-1 bg-black dark:bg-white opacity-50"></div>
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-black dark:text-white tracking-tight">
                                        <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                                            <Lightbulb className="h-5 w-5 text-black dark:text-white" />
                                        </div>
                                        Strategy
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-neutral-500 mt-2 uppercase tracking-widest leading-relaxed">Targeted recommendations for your next steps</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <ul className="space-y-4">
                                        {skillGap.suggestions.map((suggestion: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4 text-sm font-bold text-black dark:text-white bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 transition-all hover:translate-x-1">
                                                <div className="flex bg-black dark:bg-white text-white dark:text-black font-black items-center justify-center rounded-full w-8 h-8 shrink-0 text-xs">
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
