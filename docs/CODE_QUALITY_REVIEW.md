# Code quality review — TinyFish Edition

Reviewed on 20 October 2026. This pass improves failure handling, resource cleanup and repeatable checks while preserving the workspace panels, execution policies, approval requirements, provider adapters and sandbox connectors. It does not add instructions intended to influence an AI reviewer.

## Changes

| Area | Improvement | Behavior retained |
| --- | --- | --- |
| Web-reference integrity | One shared verifier checks the schema, approved source, SHA-256, exact 15-minute lifetime and freshness. Corrupt stored JSON and a substituted evidence ID produce a controlled conflict. | Public web text remains untrusted and cannot expand customer permissions. |
| Database access | TinyFish checks the assigned ticket directly instead of loading plans, invoices, messages and audit events for the entire dashboard. | Records remain scoped to the authenticated owner and ticket. |
| Response streams | TinyFish releases its reader lock after success, malformed responses and size-limit failures. | Response size limits, timeouts, redirect restrictions and credential redaction remain enforced. |
| Audit UI | Cancellable reads ignore obsolete results. Incident detail requests are cancelled when navigating away. Duplicate analyze submissions are locked; an update cannot close another incident. | Identity ranking, pagination, incident inspection, analysis and exports remain available. |
| Stored audit evidence | Safe JSON/schema parsing prevents malformed records from crashing the panel and visibly identifies incomplete evidence. | The recorded gateway decision and downloadable original evidence remain available. |
| Ticket forms | Keyed forms reset credentials and proposal examples when changing tickets; attached evidence is cleared by the selection event. | One-use TinyFish keys are never persisted in browser storage. |
| API errors | Attack Lab endpoints return fixed operational errors rather than raw database exceptions. A secondary failure while recording a rejected prompt cannot suppress the intended error response. | Valid requests, validation failures, approval conflicts and recorded executions keep their existing workflows. |
| Developer checks | Zero-warning lint, scoped generated-file exclusions, `npm run verify`, and two GitHub Actions jobs make quality checks reproducible. | Application code remains under strict TypeScript and React hook checks. Vendored UI keeps its existing scoped exceptions. |

## Verification performed locally

| Check | Result |
| --- | --- |
| ESLint across the repository | Pass; zero errors or warnings |
| Strict TypeScript | Pass |
| TypeScript tests | 262 passed, none skipped; includes five new regression tests |
| Python observer tests | 13 passed, none skipped |
| Production build | Pass; Vinext emits an informational route-classification notice |
| Security policy fixtures | 16 cases; 11 attacks blocked, no false blocks on five legitimate cases |
| Support policy fixtures | 20/20 match the stated ground truth; 0/15 unsafe actions authorized |
| Combination comparison | Five controls compared on identical proposals; selected boundary policy authorizes 0/21 unsafe actions and blocks 0/14 legitimate actions |
| Support HTTP/D1 integration | Eight groups passed; 11 plans staged; concurrency, idempotency, rollback and recovery checked. Only test-owned connector effects were recovered. |
| Attack Lab HTTP integration | Request validation, secret redaction, memory/recipient boundaries, concurrent approval, analyzed logs, JSON export, prompt/user PDFs and benchmark passed |
| TinyFish HTTP/UI markup | Seven checks passed, including identity/origin validation, source restrictions, secure key input, escaped reference text and all five workspace routes |
| Actual pretrained observer HTTP integration | Six groups passed, including complete multi-window coverage and unchanged mandatory approval |
| Actual pretrained development evaluation | All 12 inputs classified; one missed suspicious input and one false alarm. Warm local round-trip p50 1,271 ms and p95 1,601 ms. This is a small authored development set, not a general detection-rate claim. |
| Publication scan | 468 historical blobs checked before the new commit; no configured local credentials, TinyFish keys or secret environment files found |

Machine-readable evidence is in `output/code-quality-check.json`, `output/support-http-check.json`, `output/observer-http-check.json`, `output/observer-evaluation.json`, `output/tinyfish-http-check.json`, `output/support-evaluation.json` and `output/combination-evaluation.json`.

## Reproduce

Use Node 24 and install the lockfile with `npm ci`. Run `npm run verify`. For Python, follow `services/observer/README.md`, then run `npm run test:observer`.

Start the authenticated local app and observer before running `npm run check:support`, `npm run check:local`, `npm run check:tinyfish-http`, `npm run check:observer`, and `npm run evaluate:observer`. HTTP suites create synthetic audit records. Tests do not send real email or move money.

## Limits

This pass did not repeat paid/provider-dependent live generation. The earlier actual TinyFish fetch and reference-only approval/execution/recovery succeeded; the Gemini live planner previously timed out. These outcomes remain explicitly recorded, with no silent replay fallback. Model adapters are also covered by scripted success and failure tests.

Browser visual and interactive verification could not be performed because of the existing browser URL-policy restriction. HTTP checks, rendered component markup and deterministic animation-clock tests provide separate coverage; they do not establish visual behavior on every screen size.

GitHub Actions runs after publication. Its remote status must be checked independently of these local results. Hosting publication, presentation slides and social posts are separate from this repository update.
