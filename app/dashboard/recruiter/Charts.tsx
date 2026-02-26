"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

export function PipelineChart({ data }: { data: { stage: string; count: number; fill: string }[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#e2e8f0" }}
                    cursor={{ fill: "rgba(99,102,241,0.08)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function TimelineChart({ data }: { data: { date: string; applications: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} fill="url(#appGradient)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
