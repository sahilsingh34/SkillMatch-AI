const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userRole = await prisma.user.upsert({
            where: { clerkId: 'test_123' },
            update: { role: 'SEEKER' },
            create: {
                clerkId: 'test_123',
                email: 'test_123@example.com',
                role: 'SEEKER',
            },
        });
        console.log("Success:", userRole);
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
