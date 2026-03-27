import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

function Bar({ label, value, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
      <p className="text-sm text-slate-600">{label}</p>
      <div className="mt-3 h-3 w-full rounded-full bg-slate-100">
        <div className={`h-3 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-700">{value}%</p>
    </article>
  );
}

export default function AnalyticsPage() {
  const { derived, tasks } = useAppContext();
  const total = tasks.length || 1;
  const done = tasks.filter((task) => task.status === "done").length;
  const automation = Math.max(35, derived.completionRate);
  const timeSaved = Math.min(88, 45 + done * 5);
  const completionRate = Math.round((done / total) * 100);

  return (
    <>
      <PageHeader title="Analytics" subtitle="KPIs for time saved, automation coverage, and completion rate." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Bar label="Time Saved" value={timeSaved} color="bg-primary" />
        <Bar label="Automation %" value={automation} color="bg-amber-500" />
        <Bar label="Completion Rate" value={completionRate} color="bg-emerald-500" />
      </div>
    </>
  );
}
