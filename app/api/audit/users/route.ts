import { NextResponse } from "next/server";
import { listActorSummaries } from "@/lib/security/run-store";

export async function GET() {
  try { return NextResponse.json({ users: await listActorSummaries() }); }
  catch { return NextResponse.json({ error: "Audit lookup failed. Please retry." }, { status: 500 }); }
}
