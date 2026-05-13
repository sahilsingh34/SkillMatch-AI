import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { defaultModel } from '@/lib/ai';
import { z } from 'zod';

// Mock skill extraction fallback
function mockExtractSkills(text: string) {
    const lowerText = text.toLowerCase();
    const possibleSkills = [
        "React", "Next.js", "TypeScript", "JavaScript", "Python", "Go",
        "PostgreSQL", "AWS", "Kubernetes", "Docker", "GraphQL", "Redux",
        "Tailwind CSS", "Figma", "Redis", "Node.js", "MongoDB", "SQL",
        "Java", "C++", "Git", "CI/CD", "REST API", "Agile", "Scrum",
        "Machine Learning", "TensorFlow", "Vue.js", "Angular", "Swift",
        "Kotlin", "Flutter", "Firebase", "Azure", "GCP", "Linux",
        "HTML", "CSS", "Sass", "Webpack", "Vite", "Jest", "Cypress"
    ];
    const matched = possibleSkills.filter(skill =>
        lowerText.includes(skill.toLowerCase())
    );
    if (matched.length === 0) {
        matched.push("Communication", "Problem Solving", "Teamwork");
    }
    return matched;
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text || text.length < 20) {
            return NextResponse.json({ error: "Invalid or too short resume text provided" }, { status: 400 });
        }

        // Check if NVIDIA API key is configured
        const hasApiKey = !!process.env.NVIDIA_API_KEY;

        if (hasApiKey) {
            try {
                const prompt = `You are an expert technical recruiter and resume parser. Analyze the following resume text and extract the core skills and a professional summary.\n\nResume Text:\n${text}`;
                
                const { object } = await generateObject({
                    model: defaultModel,
                    schema: z.object({
                        skills: z.array(z.string()).describe("A list of 10-15 key technical and soft skills found in the resume."),
                        summary: z.string().describe("A 2-3 sentence professional summary of the candidate based on the resume."),
                        yearsOfExperience: z.number().optional().describe("Estimated total years of professional experience, if discernible.")
                    }),
                    prompt
                });

                return NextResponse.json({
                    success: true,
                    skills: object.skills || [],
                    summary: object.summary || "",
                    yearsOfExperience: object.yearsOfExperience || null,
                    source: "nvidia"
                });
            } catch (llmError) {
                console.error("NVIDIA API Error, falling back to mock:", llmError);
                // Fall through to mock extraction
            }
        }

        // Mock extraction fallback
        const skills = mockExtractSkills(text);
        const summary = `AI Skill Fingerprint generated from resume analysis. The candidate demonstrates proficiency in ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ` and ${skills.length - 3} other skills` : ''}.`;

        return NextResponse.json({
            success: true,
            skills,
            summary,
            source: "mock"
        });

    } catch (error) {
        console.error("Parse Error:", error);
        return NextResponse.json({ error: "Failed to parse resume with AI" }, { status: 500 });
    }
}
