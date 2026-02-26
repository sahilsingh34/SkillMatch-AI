import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function switchRole(formData: FormData) {
    "use server";
    const { userId } = await auth();
    if (!userId) redirect("/auth/login");

    const newRole = formData.get("role") as "SEEKER" | "RECRUITER";

    try {
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: { role: newRole },
            create: { clerkId: userId, email: `dev_${userId}@clerk.local`, role: newRole },
        });
    } catch (e) {
        console.error("switch-role: DB error", e);
    }

    revalidatePath("/");
    redirect(newRole === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile");
}

export default async function SwitchRolePage() {
    const { userId } = await auth();
    if (!userId) redirect("/auth/login");

    let user = null;
    try {
        user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { role: true, email: true },
        });
    } catch (e) {
        console.error("switch-role: DB error fetching user", e);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="bg-card border rounded-2xl p-10 max-w-md w-full mx-4 shadow-xl space-y-6">
                <div>
                    <span className="text-xs font-mono bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">DEV ONLY</span>
                    <h1 className="text-2xl font-bold mt-3">Switch Role</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Current role: <strong className="text-primary">{user?.role ?? "None"}</strong>
                        <br />
                        Account: {user?.email ?? "Loading..."}
                    </p>
                </div>

                <form action={switchRole} className="space-y-3">
                    <input type="hidden" name="role" value="SEEKER" />
                    <button
                        type="submit"
                        className="w-full p-4 rounded-xl border-2 border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors font-semibold text-left"
                    >
                        🔍 Switch to Job Seeker
                    </button>
                </form>

                <form action={switchRole} className="space-y-3">
                    <input type="hidden" name="role" value="RECRUITER" />
                    <button
                        type="submit"
                        className="w-full p-4 rounded-xl border-2 border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors font-semibold text-left"
                    >
                        💼 Switch to Recruiter
                    </button>
                </form>
            </div>
        </div>
    );
}
