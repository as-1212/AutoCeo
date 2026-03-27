const API = "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(`API ${path} failed: ${response.status}`);
  return response.json();
}

export const api = {
  getDashboard: () => request("/dashboard"),
  runWorkflow: (goal, context = {}) =>
    request("/workflow/run", { method: "POST", body: JSON.stringify({ goal, context }) }),
  extractNotes: (notes) =>
    request("/notes/extract", { method: "POST", body: JSON.stringify({ notes }) }),
  simulateDecision: (decision, context = {}) =>
    request("/simulate", { method: "POST", body: JSON.stringify({ decision, context }) }),
  getAudit: () => request("/audit"),
  queryMemory: (query) =>
    request("/memory/query", { method: "POST", body: JSON.stringify({ query }) })
};
