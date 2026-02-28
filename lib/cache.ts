import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Cached function to fetch a user's role by their Clerk ID.
 */
export const getCachedUserRole = (clerkId: string) =>
    unstable_cache(
        async (id: string) => {
            if (!id) return null;
            try {
                const user = await prisma.user.findUnique({
                    where: { clerkId: id },
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
    )(clerkId);

/**
 * Cached function to fetch jobs with filters and pagination.
 */
export const getCachedJobs = (where: any, orderBy: any, skip: number, take: number) =>
    unstable_cache(
        async (w: any, o: any, s: number, t: number) => {
            try {
                const [jobs, total] = await Promise.all([
                    prisma.job.findMany({
                        where: w,
                        orderBy: o,
                        skip: s,
                        take: t,
                    }),
                    prisma.job.count({ where: w })
                ]);

                // Ensure dates are stringified for consistent caching but handled later
                return {
                    jobs: JSON.parse(JSON.stringify(jobs)), // Serialize immediately to POJO
                    total
                };
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
    )(where, orderBy, skip, take);
