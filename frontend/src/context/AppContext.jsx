import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AppContext = createContext(null);

function toTaskFromMeeting(task, index) {
  return {
    id: task.id || `meeting-task-${index + 1}`,
    title: task.text,
    owner: task.owner || "Unassigned",
    priority: task.priority || "medium",
    status: "todo"
  };
}

export function AppProvider({ children }) {
  const [dashboard, setDashboard] = useState({});
  const [audit, setAudit] = useState([]);
  const [meetingOutput, setMeetingOutput] = useState({ decisions: [], owners: [], tasks: [] });
  const [tasks, setTasks] = useState([]);
  const [workflowResult, setWorkflowResult] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState({ dashboard: true, run: false, extract: false, simulate: false });

  const loadCoreData = async () => {
    setLoading((prev) => ({ ...prev, dashboard: true }));
    try {
      const [db, aud] = await Promise.all([api.getDashboard(), api.getAudit()]);
      setDashboard(db);
      setAudit(aud.entries || []);
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false }));
    }
  };

  useEffect(() => {
    loadCoreData();
  }, []);

  const extractFromMeeting = async (notes) => {
    setLoading((prev) => ({ ...prev, extract: true }));
    try {
      const result = await api.extractNotes(notes);
      const decisions = notes
        .split("\n")
        .map((line) => line.trim().replace(/^-+\s*/, ""))
        .filter((line) => line.length > 8)
        .slice(0, 4);
      const owners = [...new Set(decisions.map((line) => line.split(" ")[0]))];
      setMeetingOutput({ decisions, owners, tasks: result.tasks || [] });
      setTasks((prev) => [...result.tasks.map(toTaskFromMeeting), ...prev]);
    } finally {
      setLoading((prev) => ({ ...prev, extract: false }));
    }
  };

  const createTasksFromMeeting = () => {
    setTasks((prev) => [...meetingOutput.tasks.map(toTaskFromMeeting), ...prev]);
  };

  const runWorkflow = async (goal) => {
    setLoading((prev) => ({ ...prev, run: true }));
    try {
      const result = await api.runWorkflow(goal, { workflowId: dashboard.workflow?.id });
      setWorkflowResult(result);
      const aud = await api.getAudit();
      setAudit(aud.entries || []);
      return result;
    } finally {
      setLoading((prev) => ({ ...prev, run: false }));
    }
  };

  const runSimulation = async (decision) => {
    setLoading((prev) => ({ ...prev, simulate: true }));
    try {
      const result = await api.simulateDecision(decision);
      setSimulation(result);
    } finally {
      setLoading((prev) => ({ ...prev, simulate: false }));
    }
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  const derived = useMemo(() => {
    const steps = dashboard.workflow?.steps || [];
    const completedSteps = steps.filter((step) => step.status === "completed").length;
    const completionRate = steps.length ? Math.round((completedSteps / steps.length) * 100) : 0;
    const delayedTasks = tasks.filter((task) => task.status !== "done" && task.priority === "high").length;
    const riskLevel = dashboard.failurePrediction?.riskLevel || "medium";
    return { completionRate, delayedTasks, riskLevel };
  }, [dashboard.workflow, dashboard.failurePrediction, tasks]);

  return (
    <AppContext.Provider
      value={{
        dashboard,
        audit,
        tasks,
        meetingOutput,
        workflowResult,
        simulation,
        loading,
        derived,
        loadCoreData,
        extractFromMeeting,
        createTasksFromMeeting,
        runWorkflow,
        runSimulation,
        updateTaskStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppContext must be used within AppProvider");
  return value;
}
