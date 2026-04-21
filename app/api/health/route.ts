import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env_keys_check: {
      has_clerk_key: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_db_url: !!process.env.DATABASE_URL,
    }
  });
}
