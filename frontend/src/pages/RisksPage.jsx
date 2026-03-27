import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

export default function RisksPage() {
  const { dashboard, derived, tasks } = useAppContext();
  const slaBreaches = dashboard.failurePrediction?.riskScore > 0.7 ? 2 : 0;
  const delayed = derived.delayedTasks;
  const escalation = tasks.filter((task) => task.priority === "high" && task.status !== "done").length;

  return (
    <>
      <PageHeader title="Risk & Escalation Panel" subtitle="Proactive SLA breaches, delays, and escalation trigger intelligence." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-rose-100 bg-rose-50 p-4 shadow-premium">
          <h3 className="font-heading text-xl text-rose-700">SLA Alerts</h3>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{slaBreaches}</p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-premium">
          <h3 className="font-heading text-xl text-amber-700">Delayed Tasks</h3>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{delayed}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
          <h3 className="font-heading text-xl text-dark">Escalation Triggers</h3>
          <p className="mt-2 text-3xl font-semibold text-primary">{escalation}</p>
        </article>
      </div>
    </>
  );
}
