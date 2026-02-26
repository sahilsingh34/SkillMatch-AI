"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Inbox } from "lucide-react";
import Link from "next/link";

import { getJobSeekerProfileAction } from "./actions";

export default function ProfileDashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

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
    }, [getJobSeekerProfileAction]);

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

            // The upload route now directly handles Gemini AI extraction
            setSkills(data.skills ? data.skills.split(',').map((s: string) => s.trim()) : []);
            setSummary(data.message || "Resume processed successfully.");
            if (data.resumeUrl) setResumeUrl(data.resumeUrl);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl mt-16 md:mt-24">
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
                                <Button className="w-full" variant="outline" asChild>
                                    <a href={`/jobs?skills=${encodeURIComponent(skills.join(','))}`}>View Matched Jobs</a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
