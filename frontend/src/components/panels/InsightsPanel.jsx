import { useState } from "react";

const SAMPLE_NOTES = `Hiring sync:
- Priya will finalize laptop procurement by Wednesday.
- IT must create Slack, email and Jira access before Day 1.
- Rahul to prepare 30-60-90 onboarding plan.
- Follow-up with legal team on NDA signature status.`;

export default function InsightsPanel({
  onExtract,
  extractedTasks,
  onSimulate,
  simulation,
  extracting,
  simulating
}) {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [decision, setDecision] = useState("Accelerate onboarding by parallelizing IT provisioning.");
  const [owners, setOwners] = useState([]);
  const [decisions, setDecisions] = useState([]);

  function parseOwnersAndDecisions(content) {
    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const parsedOwners = lines
      .filter((l) => l.includes(" will ") || l.includes(" to "))
      .map((l) => l.replace(/^-+\s*/, "").split(" ")[0]);
    const parsedDecisions = lines
      .filter((l) => l.startsWith("-"))
      .map((l) => l.replace(/^-+\s*/, ""))
      .slice(0, 3);
    setOwners([...new Set(parsedOwners)]);
    setDecisions(parsedDecisions);
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      setNotes(content);
      parseOwnersAndDecisions(content);
    };
    reader.readAsText(file);
  }

  return (
    <section className="card">
      <h3>Meeting Intelligence System</h3>
      <label>Upload transcript</label>
      <input type="file" accept=".txt,.md,.csv" onChange={handleFileUpload} />
      <label>Meeting Notes to Task Extraction</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} />
      <button
        onClick={() => {
          parseOwnersAndDecisions(notes);
          onExtract(notes);
        }}
        disabled={extracting}
      >
        {extracting ? "AI thinking..." : "Extract Decisions, Tasks, Owners"}
      </button>
      <div className="mini-grid">
        <div>
          <strong>Decisions</strong>
          <ul>
            {decisions.map((d, idx) => (
              <li key={idx}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Owners</strong>
          <ul>
            {owners.map((o, idx) => (
              <li key={idx}>{o}</li>
            ))}
          </ul>
        </div>
      </div>
      <strong>Task Tracking</strong>
      <ul className="task-list">
        {(extractedTasks?.tasks || []).map((t) => (
          <li key={t.id} className={t.priority === "high" ? "status-red" : "status-yellow"}>
            {t.text} ({t.priority})
          </li>
        ))}
      </ul>
      <div className="inline-alert warning">Escalation alert: High priority tasks pending owner confirmation.</div>

      <label>Decision Simulation Engine</label>
      <input value={decision} onChange={(e) => setDecision(e.target.value)} />
      <button onClick={() => onSimulate(decision)} disabled={simulating}>
        {simulating ? "AI thinking..." : "Simulate"}
      </button>
      {simulation && (
        <div className="sim">
          <p>
            <strong>Best:</strong> {simulation.bestCase}
          </p>
          <p>
            <strong>Base:</strong> {simulation.baseCase}
          </p>
          <p>
            <strong>Worst:</strong> {simulation.worstCase}
          </p>
        </div>
      )}
    </section>
  );
}
