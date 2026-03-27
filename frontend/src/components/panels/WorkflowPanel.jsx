export default function WorkflowPanel({ workflow, failurePrediction }) {
  const steps = workflow?.steps || [];
  const completed = steps.filter((s) => s.status === "completed").length;
  const progress = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <section className="card">
      <h3>Workflow Tracker</h3>
      <p className="muted">{workflow?.name || "Loading workflow..."}</p>
      <div className="pipeline">
        <div className="pipeline-track">
          <div className="pipeline-progress" style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}% complete</span>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <div key={step.id} className="step">
            <strong>{step.title}</strong>
            <div className="meta">{step.owner}</div>
            <span className={`badge status-${step.status}`}>{step.status}</span>
          </div>
        ))}
      </div>
      {failurePrediction && (
        <div className="inline-alert">
          <strong>Failure Prediction:</strong> {failurePrediction.riskLevel.toUpperCase()} (
          {(failurePrediction.riskScore * 100).toFixed(0)}%)
        </div>
      )}
    </section>
  );
}
