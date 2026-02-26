import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

/**
 * GET /api/v1/jobs
 * List jobs with pagination, filtering, and sorting
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Filtering
        const location = searchParams.get("location");
        const type = searchParams.get("type");
        const company = searchParams.get("company");
        const search = searchParams.get("search");

        // Sorting
        const sort = searchParams.get("sort") || "newest"; // newest, salary_desc, salary_asc

        const where: any = {};
        if (location) where.location = { contains: location, mode: 'insensitive' };
        if (type) where.type = type;
        if (company) where.company = { contains: company, mode: 'insensitive' };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } }
            ];
        }

        let orderBy: any = { postedAt: 'desc' };
        if (sort === 'salary_desc') orderBy = { salary: 'desc' };
        if (sort === 'salary_asc') orderBy = { salary: 'asc' };

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    recruiter: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.job.count({ where })
        ]);

        return NextResponse.json({
            jobs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("API Jobs GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/v1/jobs
 * Create a new job posting (Recruiter only)
 */
export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user || user.role !== 'RECRUITER') {
            return NextResponse.json({ error: "Forbidden: Only recruiters can post jobs" }, { status: 403 });
        }

        const body = await req.json();
        const { title, company, description, location, type, salary } = body;

        if (!title || !company || !description) {
            return NextResponse.json({ error: "Title, Company, and Description are required" }, { status: 400 });
        }

        // AI Skill Extraction
        let extractedSkills: string[] = ["Generalist"];
        if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            try {
                const { text } = await generateText({
                    model: google("gemini-1.5-flash"), // Using available model
                    prompt: `Extract 5-10 core skills from this job description: ${description}. Return as a comma-separated list.`
                });
                extractedSkills = text.split(",").map(s => s.trim());
            } catch (aiError) {
                console.error("API Job Post AI error:", aiError);
            }
        }

        const job = await prisma.job.create({
            data: {
                title,
                company,
                description,
                location: location || "Remote",
                type: type || "Full-time",
                salary: salary || "Competitive",
                skills: extractedSkills.join(", "),
                recruiterId: user.id
            }
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error("API Jobs POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
