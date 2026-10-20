import { sourceMatches, webEvidenceSchema, type WebEvidence } from "./types";

export const WEB_EVIDENCE_TTL_MS = 15 * 60 * 1000;

export async function contentHash(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

/** One integrity contract for stored references and sealed plan receipts. */
export async function verifiedWebEvidence(value: unknown, at: number): Promise<WebEvidence | null> {
  const parsed = webEvidenceSchema.safeParse(value);
  if (!parsed.success || !Number.isFinite(at)) return null;
  const evidence = parsed.data;
  const fetched = Date.parse(evidence.fetchedAt);
  const expires = Date.parse(evidence.expiresAt);
  if (fetched > at || expires <= at || expires - fetched !== WEB_EVIDENCE_TTL_MS
    || !sourceMatches(evidence.sourceId, evidence.url)
    || !sourceMatches(evidence.sourceId, evidence.finalUrl)
    || await contentHash(evidence.text) !== evidence.sha256) return null;
  return evidence;
}
