import { reasonWithLLM } from "./llmService.js";
import { addAuditEntry } from "./auditService.js";
import { storeMemory } from "./memoryService.js";

export async function extractTasksFromNotes(notes) {
  const llm = await reasonWithLLM(
    "Extract actionable enterprise tasks from meeting notes. Return compact bullet list.",
    notes
  );

  const heuristicTasks = notes
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line, i) => ({
      id: `task-${i + 1}`,
      text: line.replace(/^-+\s*/, ""),
      priority: i < 2 ? "high" : "medium"
    }));

  const output = { llmReasoning: llm.text, tasks: heuristicTasks };
  addAuditEntry("executor", "extracted_tasks_from_notes", { count: heuristicTasks.length });
  storeMemory(`Extracted ${heuristicTasks.length} tasks from meeting notes.`);
  return output;
}

export async function simulateDecision(decision, context = {}) {
  const llm = await reasonWithLLM(
    "Simulate outcomes before execution. Mention best case, base case, worst case and mitigation.",
    `${decision}\nContext: ${JSON.stringify(context)}`
  );

  const simulation = {
    decision,
    bestCase: "On-time delivery with high team confidence.",
    baseCase: "Minor delays, acceptable completion quality.",
    worstCase: "Cross-team dependency failure and deadline slip.",
    mitigation: "Stage rollout and add review checkpoints.",
    llmReasoning: llm.text
  };
  addAuditEntry("planner", "simulated_decision", { decision });
  storeMemory(`Simulation generated for decision: ${decision}`);
  return simulation;
}

export function predictFailure(workflow) {
  const delayedSteps = workflow.steps.filter((s) => s.status === "blocked" || s.status === "pending").length;
  const riskScore = Math.min(0.95, 0.25 + delayedSteps * 0.15);
  const risks = [];
  if (riskScore > 0.5) risks.push("Dependency risk between HR and IT provisioning.");
  if (riskScore > 0.7) risks.push("Potential onboarding day-1 readiness failure.");
  if (risks.length === 0) risks.push("No major early indicators detected.");

  const prediction = {
    riskScore,
    riskLevel: riskScore > 0.7 ? "high" : riskScore > 0.45 ? "medium" : "low",
    risks
  };
  addAuditEntry("validator", "predicted_failure", prediction);
  return prediction;
}
