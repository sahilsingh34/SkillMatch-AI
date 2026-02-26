"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Inbox, Sparkles, TrendingUp, Target, Lightbulb } from "lucide-react";
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
        <div className="container mx-auto px-4 py-8 max-w-5xl mt-16 md:mt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground mt-1">Upload your resume to let our AI build your skill fingerprint.</p>
                </div>
                <Button variant="outline" className="shrink-0" asChild>
                    <Link href="/dashboard/profile/applications">
                        <Inbox className="mr-2 h-4 w-4" />
                        My Applications
                    </Link>
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Column */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resume Upload</CardTitle>
                        <CardDescription>Drag and drop your resume (PDF/DOCX) here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                                }`}
                        >
                            <input {...getInputProps()} />

                            {!file ? (
                                <div className="flex flex-col items-center">
                                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                                    <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PDF or DOCX (max. 5MB)</p>
                                    {resumeUrl && (
                                        <p className="text-xs text-emerald-500 mt-4 px-2 py-1 bg-emerald-500/10 rounded-md font-medium border border-emerald-500/20">
                                            ✓ You already have a resume on file. Uploading a new one will overwrite it.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FileText className="h-10 w-10 text-primary mb-4" />
                                    <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-4 text-xs"
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
                            <div className="mt-4 flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full mt-6"
                            disabled={!file || isUploading}
                            onClick={handleUpload}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Resume...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Extract Skills
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results / Status Column */}
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>Your AI Fingerprint</CardTitle>
                        <CardDescription>Extracted skills will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingProfile ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center text-muted-foreground space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin opacity-50" />
                                <p className="text-sm px-8">Loading your profile data...</p>
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center text-muted-foreground space-y-4">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 opacity-20" />
                                </div>
                                <p className="text-sm px-8">Upload a resume to generate your unique skill profile and unlock personalized job matches.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                    <h4 className="font-medium text-sm mb-2 text-primary">AI Summary</h4>
                                    <p className="text-sm text-muted-foreground">{summary}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-3">Extracted Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <div key={skill} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button className="flex-1" variant="outline" asChild>
                                        <a href={`/jobs?skills=${encodeURIComponent(skills.join(','))}`}>View Matched Jobs</a>
                                    </Button>
                                    <Button
                                        className="flex-1"
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
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Skill Gap Analysis
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
                <div className="mt-8 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        AI Career Analysis
                    </h2>

                    {/* Profile Strength + Summary row */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Profile Strength */}
                        <Card className="bg-muted/30">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="relative inline-flex items-center justify-center w-28 h-28">
                                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                                            <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="none"
                                                className={skillGap.profileStrength > 70 ? "text-green-500" : skillGap.profileStrength > 40 ? "text-amber-500" : "text-red-500"}
                                                strokeDasharray={`${(skillGap.profileStrength / 100) * 339.3} 339.3`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute text-2xl font-bold">{skillGap.profileStrength}%</span>
                                    </div>
                                    <p className="text-sm font-medium mt-3">Profile Strength</p>
                                    <p className="text-xs text-muted-foreground mt-1">Based on {skillGap.totalJobs} job{skillGap.totalJobs !== 1 ? 's' : ''} in market</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary + Strong Skills */}
                        <Card className="md:col-span-2 bg-muted/30">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Career Insight</h4>
                                        <p className="text-sm text-muted-foreground">{skillGap.summary}</p>
                                    </div>
                                </div>
                                {skillGap.strongSkills.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Your Top Skills (In Demand)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skillGap.strongSkills.map((skill: string) => (
                                                    <span key={skill} className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium rounded-md">
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
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Missing Skills */}
                        <Card className="bg-muted/30 border-amber-500/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="h-5 w-5 text-amber-400" />
                                    Skills to Learn
                                </CardTitle>
                                <CardDescription>In-demand skills missing from your profile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {skillGap.missingSkills.map((skill: string) => (
                                        <span key={skill} className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium rounded-md">
                                            + {skill}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suggestions */}
                        <Card className="bg-muted/30 border-blue-500/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-blue-400" />
                                    AI Recommendations
                                </CardTitle>
                                <CardDescription>Personalized career suggestions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {skillGap.suggestions.map((suggestion: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-blue-400 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
