import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Cached function to fetch a user's role by their Clerk ID.
 * Revalidates every 1 hour (3600 seconds) or when the 'user-role' tag is invalidated.
 */
export const getCachedUserRole = (clerkId: string) =>
    unstable_cache(
        async () => {
            if (!clerkId) return null;
            try {
                const user = await prisma.user.findUnique({
                    where: { clerkId },
                    select: { role: true },
                });
                return user?.role ?? null;
            } catch (e) {
                console.error("getCachedUserRole: failed to fetch user role", e);
                return null;
            }
        },
        [`user-role-${clerkId}`],
        {
            revalidate: 3600, // 1 hour
            tags: ["user-role"],
        }
    )();

/**
 * Cached function to fetch jobs with filters and pagination.
 * Revalidates every 1 minute (60 seconds).
 */
export const getCachedJobs = (where: any, orderBy: any, skip: number, take: number) =>
    unstable_cache(
        async () => {
            try {
                const [jobs, total] = await Promise.all([
                    prisma.job.findMany({
                        where,
                        orderBy,
                        skip,
                        take,
                    }),
                    prisma.job.count({ where })
                ]);
                return { jobs, total };
            } catch (e) {
                console.error("getCachedJobs: failed to fetch jobs", e);
                return { jobs: [], total: 0 };
            }
        },
        [`jobs-${JSON.stringify(where)}-${JSON.stringify(orderBy)}-${skip}-${take}`],
        {
            revalidate: 60, // 1 minute
            tags: ["jobs-list"],
        }
    )();
