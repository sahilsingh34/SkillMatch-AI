"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map(function ({ id, title, description, action, open, ...props }) {
                if (open === false) return null;
                return (
                    <div
                        key={id}
                        {...props}
                        className="group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all border-neutral-800 bg-neutral-900 text-neutral-50 mt-2 animate-in fade-in slide-in-from-right-full duration-300"
                    >
                        <div className="grid gap-1">
                            {title && <div className="text-sm font-semibold tracking-tight">{title}</div>}
                            {description && (
                                <div className="text-xs opacity-70 font-medium leading-relaxed">{description}</div>
                            )}
                        </div>
                        {action}
                    </div>
                )
            })}
        </div>
    )
}
