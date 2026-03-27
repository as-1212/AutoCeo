import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { hrOnboardingWorkflow, sampleMeetingNotes } from "./data/mockData.js";
import { runAgentWorkflow, queryAgentMemory } from "./agents/orchestrator.js";
import { getAuditLog } from "./services/auditService.js";
import { extractTasksFromNotes, predictFailure, simulateDecision } from "./services/intelligenceService.js";
import { getAllMemory, storeMemory } from "./services/memoryService.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

storeMemory("HR onboarding requires cross-functional execution and compliance validation.");
storeMemory("Past onboarding delays happened due to late account provisioning.");

app.get("/api/health", (_, res) => res.json({ status: "ok", app: "AutoCEO backend" }));

app.get("/api/dashboard", async (_, res) => {
  const failure = predictFailure(hrOnboardingWorkflow);
  res.json({
    workflow: hrOnboardingWorkflow,
    failurePrediction: failure,
    explainability: {
      activeAgents: ["planner", "executor", "validator", "memory"],
      message: "Planner creates strategy, executor runs tasks, validator checks quality, memory retrieves context."
    }
  });
});

app.post("/api/workflow/run", async (req, res) => {
  const { goal, context } = req.body;
  if (!goal) return res.status(400).json({ error: "goal is required" });
  const output = await runAgentWorkflow(goal, context);
  res.json(output);
});

app.post("/api/notes/extract", async (req, res) => {
  const notes = req.body.notes || sampleMeetingNotes;
  const data = await extractTasksFromNotes(notes);
  res.json(data);
});

app.post("/api/simulate", async (req, res) => {
  const { decision, context } = req.body;
  if (!decision) return res.status(400).json({ error: "decision is required" });
  const simulation = await simulateDecision(decision, context);
  res.json(simulation);
});

app.get("/api/audit", (_, res) => res.json({ entries: getAuditLog() }));
app.get("/api/memory", (_, res) => res.json({ vectors: getAllMemory() }));
app.post("/api/memory/query", (req, res) => res.json({ results: queryAgentMemory(req.body.query || "") }));

app.listen(PORT, () => {
  console.log(`AutoCEO backend listening on ${PORT}`);
});
