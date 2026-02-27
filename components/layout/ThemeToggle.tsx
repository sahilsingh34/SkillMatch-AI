"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function ThemeToggle() {
    return (
        <AnimatedThemeToggler
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-all duration-200"
        />
    );
}
