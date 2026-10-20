import assert from "node:assert/strict";
import test from "node:test";
import { auditPayloads } from "../lib/security/audit-payload";

test("damaged or historical audit JSON cannot crash incident rendering", () => {
  for (const value of [undefined, null, "{broken", "null", "[]", '"text"', '{"findings":true}']) {
    assert.deepEqual(auditPayloads({ evaluationJson: value, actionJson: value }).findings, []);
    assert.equal(auditPayloads({ actionJson: value }).action, null);
  }
  assert.equal(auditPayloads({ executionJson: "{broken" }).execution, null);
  assert.equal(auditPayloads({ evaluationJson: "{broken" }).incomplete, true);
  assert.equal(auditPayloads(null).incomplete, false);
});

test("valid audit findings, action details and execution evidence remain available", () => {
  const finding = { id: "scope", title: "Outside task", description: "Wrong customer", severity: "high", evidence: { customer: "synthetic" } };
  const action = { tool: "send_email", arguments: { recipient: "example.test" } };
  assert.deepEqual(auditPayloads({ evaluationJson: JSON.stringify({ findings: [finding] }), actionJson: JSON.stringify(action), executionJson: '{"executed":false}' }), {
    findings: [finding], action, execution: { executed: false }, incomplete: false,
  });
});
