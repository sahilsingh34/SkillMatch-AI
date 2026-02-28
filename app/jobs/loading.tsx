import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsLoading() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            {/* Hero Header Skeleton */}
            <section className="pt-36 pb-32 px-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto max-w-6xl text-center">
                    <Skeleton className="h-16 w-3/4 mx-auto mb-6 rounded-2xl" />
                    <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
                </div>
            </section>

            {/* Search Bar Skeleton */}
            <div className="container mx-auto max-w-6xl px-4 -mt-10 mb-16">
                <Skeleton className="h-20 w-full rounded-[2rem]" />
            </div>

            {/* Main Layout Skeleton */}
            <div className="container mx-auto px-4 max-w-7xl pb-24">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Skeleton */}
                    <div className="hidden lg:block w-64 space-y-10">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-5 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Job Feed Skeleton */}
                    <div className="flex-1 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-48 w-full rounded-[1.5rem]" />
                        ))}
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="hidden lg:block w-[320px]">
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
