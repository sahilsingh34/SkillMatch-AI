// Types
export interface JobType {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string; // Full-time, Contract, etc.
    salary: string;
    matchScore: number;
    skills: string[];
    postedAt: string;
    description?: string;
}

export type ApplicantStatus = "Applied" | "Screening" | "Interview" | "Offered" | "Rejected";

export interface ApplicantType {
    id: string;
    jobId: string;
    name: string;
    email: string;
    matchScore: number;
    skills: string[];
    experience: number;
    status: ApplicantStatus;
    appliedAt: string;
}

// Global mutable state for the mock database (persists during Next.js dev server session)
// Need to use globalThis to persist across Hot Module Reloads in Next.js development
declare global {
    var __mockDb: {
        jobs: JobType[];
        applicants: ApplicantType[];
    } | undefined;
}

const initialJobs: JobType[] = [
    {
        id: "1",
        title: "Senior Full Stack Engineer",
        company: "TechNova Solutions",
        location: "Remote",
        type: "Full-time",
        salary: "$140k - $180k",
        matchScore: 98,
        skills: ["React", "Node.js", "PostgreSQL", "AWS"],
        postedAt: "2h ago",
        description: "Looking for an experienced engineer to lead our core product team."
    },
    {
        id: "2",
        title: "Frontend Developer",
        company: "Creative Pulse",
        location: "New York, NY (Hybrid)",
        type: "Full-time",
        salary: "$110k - $140k",
        matchScore: 92,
        skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
        postedAt: "5h ago",
    },
    {
        id: "3",
        title: "Backend Systems Engineer",
        company: "DataFlow Inc",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$160k - $210k",
        matchScore: 85,
        skills: ["Go", "Python", "Kubernetes", "Redis"],
        postedAt: "1d ago",
    },
    {
        id: "4",
        title: "React Native Developer",
        company: "AppSphere",
        location: "Remote",
        type: "Contract",
        salary: "$80 - $120 / hr",
        matchScore: 78,
        skills: ["React Native", "TypeScript", "GraphQL", "Redux"],
        postedAt: "2d ago",
    },
];

const initialApplicants: ApplicantType[] = [
    {
        id: "app-1",
        jobId: "1",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        matchScore: 95,
        skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript"],
        experience: 5,
        status: "Interview",
        appliedAt: "1 day ago"
    },
    {
        id: "app-2",
        jobId: "1",
        name: "John Smith",
        email: "john.s@example.com",
        matchScore: 82,
        skills: ["React", "Express", "MongoDB"],
        experience: 3,
        status: "Applied",
        appliedAt: "2 hours ago"
    },
    {
        id: "app-3",
        jobId: "2",
        name: "Alice Johnson",
        email: "alice@example.com",
        matchScore: 90,
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        experience: 4,
        status: "Screening",
        appliedAt: "3 days ago"
    }
];

if (!globalThis.__mockDb) {
    globalThis.__mockDb = {
        jobs: [...initialJobs],
        applicants: [...initialApplicants]
    };
}

export const MockDB = {
    // Job Methods
    getJobs: () => globalThis.__mockDb!.jobs,
    getJobById: (id: string) => globalThis.__mockDb!.jobs.find(j => j.id === id),
    addJob: (job: JobType) => {
        globalThis.__mockDb!.jobs.unshift(job); // Add to beginning
        return job;
    },

    // Applicant Methods
    getApplicantsForJob: (jobId: string) =>
        globalThis.__mockDb!.applicants
            .filter(a => a.jobId === jobId)
            .sort((a, b) => b.matchScore - a.matchScore),

    updateApplicantStatus: (applicantId: string, status: ApplicantStatus) => {
        const index = globalThis.__mockDb!.applicants.findIndex(a => a.id === applicantId);
        if (index !== -1) {
            globalThis.__mockDb!.applicants[index] = {
                ...globalThis.__mockDb!.applicants[index],
                status
            };
            return true;
        }
        return false;
    }
};

// Kept for backwards compatibility with Phase 1 components that import it directly
export const mockJobs = MockDB.getJobs();
