import { useMemo, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

function plannerBullets(text) {
  return (text || "")
    .split(/\n|[.;]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export default function WorkflowsPage() {
  const { dashboard, workflowResult } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const bullets = useMemo(() => plannerBullets(workflowResult?.planner?.reasoning), [workflowResult?.planner?.reasoning]);
  const stages = ["Planning", "Execution", "Validation"];
  const activeStage = workflowResult?.validator ? 3 : workflowResult?.executor ? 2 : workflowResult?.planner ? 1 : 1;

  return (
    <>
      <PageHeader title="Workflow Tracker" subtitle="Visualized enterprise pipeline from planning to validation." />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {stages.map((stage, idx) => (
            <div key={stage} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{stage}</p>
              <p className={`mt-1 text-sm font-semibold ${idx + 1 <= activeStage ? "text-primary" : "text-slate-400"}`}>
                {idx + 1 <= activeStage ? "Completed" : "Queued"}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium">
        <h3 className="font-heading text-2xl">Planner Output</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2">
              <span>{i === 0 ? "🎯" : i === 1 ? "⚙️" : i === 2 ? "✅" : "📌"}</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => setExpanded((prev) => !prev)} className="mt-3 rounded-xl bg-dark px-4 py-2 text-sm font-semibold text-white">
          {expanded ? "Hide details" : "Expand for details"}
        </button>
        {expanded && <p className="mt-3 text-sm text-slate-700">{workflowResult?.planner?.reasoning || "No planner output yet."}</p>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium">
        <h3 className="font-heading text-2xl">Workflow Source</h3>
        <p className="text-sm text-slate-700">{dashboard.workflow?.name || "HR Onboarding Pipeline"}</p>
      </section>
    </>
  );
}
