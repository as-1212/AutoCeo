import { useMemo, useState } from "react";

function toBullets(text) {
  return (text || "")
    .split(/\n|[.;]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export default function ExplainabilityPanel({ workflowResult, explainability, loading }) {
  const [expanded, setExpanded] = useState(false);
  const plannerBullets = useMemo(() => toBullets(workflowResult?.planner?.reasoning), [workflowResult?.planner?.reasoning]);

  return (
    <section className="card">
      <h3>Explainable AI Panel</h3>
      <p className="muted">{explainability?.message || "Agent reasoning is displayed after execution."}</p>

      {loading && <div className="explain-block loading">AI reasoning in progress...</div>}

      {workflowResult?.planner && !loading && (
        <div className="explain-block">
          <h4>Planner Output (Executive View)</h4>
          <ul className="planner-bullets">
            {plannerBullets.map((bullet, idx) => (
              <li key={idx}>
                <span className="icon">
                  {idx === 0 ? "🎯" : idx === 1 ? "⚙️" : idx === 2 ? "✅" : "📌"}
                </span>
                {bullet}
              </li>
            ))}
          </ul>
          <button className="ghost-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide detailed reasoning" : "Expand for detailed reasoning"}
          </button>
          {expanded && <p>{workflowResult.planner.reasoning}</p>}
        </div>
      )}
      {workflowResult?.validator && !loading && (
        <div className="explain-block">
          <h4>Validator Notes</h4>
          <p>{workflowResult.validator.notes}</p>
          <p>
            Confidence: <strong>{(workflowResult.validator.confidence * 100).toFixed(0)}%</strong>
          </p>
        </div>
      )}
    </section>
  );
}
