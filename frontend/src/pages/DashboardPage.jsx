import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

function CommandCard({ label, value, tone = "text-primary" }) {
  return (
    <article className="rounded-2xl border border-white/50 bg-white/70 p-5 shadow-premium backdrop-blur-md">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${tone}`}>{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const { dashboard, tasks, derived, loading } = useAppContext();
  const steps = dashboard.workflow?.steps || [];
  const pending = tasks.filter((task) => task.status !== "done").length + steps.filter((s) => s.status !== "completed").length;

  return (
    <>
      <PageHeader
        title="AI Command Center"
        subtitle="Editorial-grade fintech automation visibility across workflows, risks, and delivery."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CommandCard label="Active Workflows" value={loading.dashboard ? "..." : dashboard.workflow ? 1 : 0} />
        <CommandCard label="Risk Alerts" value={derived.riskLevel.toUpperCase()} tone="text-amber-600" />
        <CommandCard label="Pending Tasks" value={pending} tone="text-rose-600" />
      </div>
    </>
  );
}
