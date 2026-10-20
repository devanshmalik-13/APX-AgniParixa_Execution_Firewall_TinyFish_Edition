import { NextResponse } from "next/server";
import { getRunMetrics, listPromptRecords, listRuns, setAnalystVerdict } from "@/lib/security/run-store";
import { z } from "zod";

export async function GET() {
  try {
    const [prompts, runs, metrics] = await Promise.all([listPromptRecords(200), listRuns(200), getRunMetrics()]);
    return NextResponse.json({ prompts, runs, metrics, storage: "D1", note: "Rates use server-recorded benchmark runs in enforce mode; manual replays remain in the log but do not change the benchmark rate. The visible log shows the latest 200." });
  } catch {
    return NextResponse.json({ error: "Audit lookup failed. Please retry." }, { status: 500 });
  }
}

const verdictSchema = z.object({ runId: z.string().uuid(), verdict: z.enum(["contained", "safe"]) });

export async function PATCH(request: Request) {
  try {
    const { runId, verdict } = verdictSchema.parse(await request.json());
    const result = await setAnalystVerdict(runId, verdict);
    return NextResponse.json(result, { status: result.updated ? 200 : 409 });
  } catch (error) {
    const invalid = error instanceof z.ZodError || error instanceof SyntaxError;
    return NextResponse.json({ error: invalid ? "Provide a valid run ID and a safe or contained verdict." : "Audit update failed. Please retry." }, { status: invalid ? 400 : 500 });
  }
}
