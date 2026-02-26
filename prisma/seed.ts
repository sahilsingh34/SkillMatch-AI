import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting DB Seed...')

    // Create a Mock Recruiter User (Needed for the Job relation)
    const recruiter = await prisma.user.upsert({
        where: { email: 'recruiter@skillmatch.ai' },
        update: {},
        create: {
            email: 'recruiter@skillmatch.ai',
            clerkId: 'mock_clerk_id_123',
            firstName: 'Adam',
            lastName: 'Smith',
            role: 'RECRUITER',
        },
    })

    // Seed the Jobs
    const jobs = [
        {
            title: "Senior Full Stack Engineer",
            company: "TechNova Solutions",
            location: "Remote",
            type: "Full-time",
            salary: "$140k - $170k",
            description: "Looking for an experienced engineer to lead our core product team. Must have strong experience with modern React and Node.js.",
            skills: "React, Next.js, TypeScript, Node.js, PostgreSQL, System Design",
            recruiterId: recruiter.id
        },
        {
            title: "Frontend Developer",
            company: "Creative Studio Alpha",
            location: "On-site (New York)",
            type: "Full-time",
            salary: "$100k - $130k",
            description: "Join our creative agency building stunning, high-performance web experiences. Deep knowledge of CSS animations and React is required.",
            skills: "React, Tailwind CSS, Framer Motion, TypeScript, UI/UX, CSS",
            recruiterId: recruiter.id
        },
        {
            title: "Backend Systems Engineer",
            company: "FinTech Secure",
            location: "Hybrid (London)",
            type: "Contract",
            salary: "$80 - $110 / hr",
            description: "Help us scale our transaction processing engine. We need experts in Go or Rust with deep SQL knowledge.",
            skills: "Go, Rust, PostgreSQL, AWS, Microservices, Python, SQL",
            recruiterId: recruiter.id
        },
        {
            title: "React Native Developer",
            company: "MobileFirst Inc",
            location: "Remote",
            type: "Full-time",
            salary: "$120k - $150k",
            description: "Lead the development of our flagship mobile application. Experience with Expo and native modules is a big plus.",
            skills: "React Native, TypeScript, iOS, Android, GraphQL, Expo",
            recruiterId: recruiter.id
        }
    ]

    for (const job of jobs) {
        await prisma.job.create({
            data: job
        })
    }

    console.log('Seed completed perfectly!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
