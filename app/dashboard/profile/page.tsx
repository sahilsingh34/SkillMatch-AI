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
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="h-40 bg-white border-b border-slate-100 flex items-end pb-8">
                <div className="container max-w-5xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Your Profile</h1>
                            <p className="text-slate-500 font-medium">Upload your resume to let our AI build your skill fingerprint.</p>
                        </div>
                        <Button variant="outline" className="shrink-0 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold h-11 px-6 rounded-xl shadow-sm transition-colors" asChild>
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
                    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold text-slate-900">Resume Upload</CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-500 mt-1">Drag and drop your resume (PDF/DOCX) here.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-blue-500 bg-blue-50/50 scale-[1.02]" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                                    }`}
                            >
                                <input {...getInputProps()} />

                                {!file ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                                            <UploadCloud className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <p className="text-base font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">PDF or DOCX (max. 5MB)</p>
                                        {resumeUrl && (
                                            <p className="text-xs font-semibold text-emerald-600 mt-6 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Resume on file. Uploading a new one overrides it.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                                            <FileText className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <p className="font-bold text-slate-900 text-sm truncate max-w-[200px] mb-1">{file.name}</p>
                                        <p className="text-xs font-semibold text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-6 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 px-4"
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
                                <div className="mt-6 flex items-center text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button
                                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] transition-transform active:scale-[0.98]"
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
                    <Card className="bg-slate-50 border border-slate-100 shadow-inner rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                <Sparkles className="w-5 h-5 text-indigo-500" />
                                Your AI Fingerprint
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-500 mt-1">Extracted skills will appear here.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            {isLoadingProfile ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-5">
                                    <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                                    <p className="text-sm font-bold text-slate-500 tracking-wide">LOADING PROFILE DATA...</p>
                                </div>
                            ) : skills.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6">
                                    <div className="h-20 w-20 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                                        <Lightbulb className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 px-6 leading-relaxed">
                                        Upload a resume to generate your unique skill profile and unlock personalized job matches.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-slate-400 flex items-center">
                                            <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-500" />
                                            AI Summary
                                        </h4>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-slate-400">Extracted Skills</h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {skills.map((skill) => (
                                                <div key={skill} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-bold rounded-full">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
                                        <Button className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold h-12 rounded-xl shadow-sm" asChild>
                                            <a href={`/jobs?skills=${encodeURIComponent(skills.join(','))}`}>View Matches</a>
                                        </Button>
                                        <Button
                                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl shadow-sm"
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
                    <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 border-t border-slate-200 pt-12">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-3">
                                <Sparkles className="h-8 w-8 text-blue-500" />
                                AI Career Analysis
                            </h2>
                            <p className="text-slate-500 font-medium mt-3 max-w-2xl mx-auto">Based on real-time market data matching your extracted skill fingerprint.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Profile Strength */}
                            <Card className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
                                <CardContent className="p-8 flex items-center justify-center flex-col h-full relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 opacity-50"></div>
                                    <div className="text-center">
                                        <div className="relative inline-flex items-center justify-center w-36 h-36 mb-6">
                                            <svg className="w-36 h-36 -rotate-90 drop-shadow-sm" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100" />
                                                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="none"
                                                    className={skillGap.profileStrength > 70 ? "text-emerald-500" : skillGap.profileStrength > 40 ? "text-blue-500" : "text-amber-500"}
                                                    strokeDasharray={`${(skillGap.profileStrength / 100) * 339.3} 339.3`}
                                                    strokeLinecap="round"
                                                    style={{ transition: "stroke-dasharray 1.5s ease-out" }}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-extrabold text-slate-900">{skillGap.profileStrength}%</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MATCH</span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Profile Strength</p>
                                        <p className="text-xs font-semibold text-slate-400">Based on {skillGap.totalJobs} live job{skillGap.totalJobs !== 1 ? 's' : ''}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary + Strong Skills */}
                            <Card className="md:col-span-2 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                                            <TrendingUp className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 mb-2">Market Insight</h4>
                                            <p className="text-slate-600 font-medium leading-relaxed">{skillGap.summary}</p>
                                        </div>
                                    </div>

                                    {skillGap.strongSkills.length > 0 && (
                                        <div className="flex items-start gap-4 pt-6 border-t border-slate-100">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div className="w-full">
                                                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 mb-3">Your Strengths</h4>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {skillGap.strongSkills.map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 shadow-sm text-xs font-bold rounded-full">
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
                            <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            <Target className="h-5 w-5 text-amber-500" />
                                        </div>
                                        Skills to Learn
                                    </CardTitle>
                                    <CardDescription className="text-sm font-medium text-slate-500 mt-2">High-demand skills missing from your profile</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-2">
                                    <div className="flex flex-wrap gap-2.5">
                                        {skillGap.missingSkills.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-full flex items-center">
                                                <PlusCircle className="w-3 h-3 mr-1.5 text-amber-500" />
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Suggestions */}
                            <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Lightbulb className="h-5 w-5 text-blue-500" />
                                        </div>
                                        Strategy
                                    </CardTitle>
                                    <CardDescription className="text-sm font-medium text-slate-500 mt-2">Targeted recommendations for your next steps</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <ul className="space-y-4">
                                        {skillGap.suggestions.map((suggestion: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="flex bg-white shadow-sm border border-slate-200 text-blue-600 font-extrabold items-center justify-center rounded-full w-8 h-8 shrink-0">
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
