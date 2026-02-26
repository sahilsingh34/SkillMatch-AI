import { NextRequest, NextResponse } from 'next/server';

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

        // Check if Google Gemini API key is configured
        const hasGeminiKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (hasGeminiKey) {
            try {
                const { GoogleGenerativeAI, SchemaType } = await import('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

                const schema = {
                    type: SchemaType.OBJECT,
                    properties: {
                        skills: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: "A list of 10-15 key technical and soft skills found in the resume."
                        },
                        summary: {
                            type: SchemaType.STRING,
                            description: "A 2-3 sentence professional summary of the candidate based on the resume."
                        },
                        yearsOfExperience: {
                            type: SchemaType.NUMBER,
                            description: "Estimated total years of professional experience, if discernible."
                        }
                    },
                    required: ["skills", "summary"]
                };

                const model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash", // Reverting to 2.0-flash since 1.5 models are 404ing on this key
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: schema as any,
                    }
                });

                const prompt = `You are an expert technical recruiter and resume parser. Analyze the following resume text and extract the core skills and a professional summary.\n\nResume Text:\n${text}`;
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                const parsedResult = JSON.parse(responseText);

                return NextResponse.json({
                    success: true,
                    skills: parsedResult.skills || [],
                    summary: parsedResult.summary || "",
                    yearsOfExperience: parsedResult.yearsOfExperience || null,
                    source: "gemini"
                });
            } catch (llmError) {
                console.error("Gemini API Error, falling back to mock:", llmError);
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
