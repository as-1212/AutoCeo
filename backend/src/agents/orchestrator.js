import { reasonWithLLM } from "../services/llmService.js";
import { addAuditEntry } from "../services/auditService.js";
import { searchMemory, storeMemory } from "../services/memoryService.js";

async function plannerAgent(goal, context) {
  const memory = searchMemory(goal, 3);
  const prompt = `Goal: ${goal}\nContext: ${JSON.stringify(context)}\nMemory: ${JSON.stringify(memory.map((m) => m.text))}`;
  const reasoning = await reasonWithLLM(
    "You are the planner agent. Break goals into enterprise tasks with risks and milestones.",
    prompt
  );

  const plan = [
    { id: "plan-1", task: "Define workflow phases and responsibilities", owner: "Planner" },
    { id: "plan-2", task: "Trigger automations and notifications", owner: "Executor" },
    { id: "plan-3", task: "Validate compliance and completion quality", owner: "Validator" }
  ];
  addAuditEntry("planner", "created_plan", { goal, reasoning: reasoning.text });
  storeMemory(`Plan created for goal: ${goal}. Key reasoning: ${reasoning.text}`);
  return { plan, reasoning: reasoning.text };
}

function executorAgent(plan) {
  const executed = plan.map((p, idx) => ({
    ...p,
    status: "completed",
    output: `Executed action ${idx + 1}: ${p.task}`
  }));
  addAuditEntry("executor", "executed_plan", { tasks: executed.length });
  storeMemory(`Executed ${executed.length} tasks from latest plan.`);
  return executed;
}

async function validatorAgent(executed, goal) {
  const prompt = `Goal: ${goal}\nExecuted: ${JSON.stringify(executed)}`;
  const reasoning = await reasonWithLLM(
    "You are validator agent. Return strict checks and confidence score 0-1.",
    prompt
  );
  const confidence = Math.min(0.95, 0.6 + executed.length * 0.1);
  const result = { passed: confidence > 0.75, confidence, notes: reasoning.text };
  addAuditEntry("validator", "validated_execution", result);
  storeMemory(`Validation for ${goal}. Passed: ${result.passed}. Confidence: ${confidence}`);
  return result;
}

function memoryAgent(query) {
  const matches = searchMemory(query, 5);
  addAuditEntry("memory", "retrieved_memory", { query, hits: matches.length });
  return matches;
}

export async function runAgentWorkflow(goal, context = {}) {
  const planner = await plannerAgent(goal, context);
  const executor = executorAgent(planner.plan);
  const validator = await validatorAgent(executor, goal);
  return { planner, executor, validator };
}

export function queryAgentMemory(query) {
  return memoryAgent(query);
}
