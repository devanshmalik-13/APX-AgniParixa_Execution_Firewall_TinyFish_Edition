import { z } from "zod";

const findingSchema = z.object({
  id: z.string(), title: z.string(), description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]), evidence: z.unknown(),
});

function storedJson(value: string | null | undefined): unknown {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

/** Historical or damaged JSON must not crash the audit explorer. */
export function auditPayloads(detail: { evaluationJson?: string | null; actionJson?: string | null; executionJson?: string | null } | null) {
  const evaluation = z.object({ findings: z.array(findingSchema) }).safeParse(storedJson(detail?.evaluationJson));
  const action = z.object({ tool: z.string() }).passthrough().safeParse(storedJson(detail?.actionJson));
  const execution = storedJson(detail?.executionJson);
  return {
    findings: evaluation.success ? evaluation.data.findings : [],
    action: action.success ? action.data : null,
    execution,
    incomplete: Boolean((detail?.evaluationJson && !evaluation.success)
      || (detail?.actionJson && !action.success)
      || (detail?.executionJson && execution === null)),
  };
}
