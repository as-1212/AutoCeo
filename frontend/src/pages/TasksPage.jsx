import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" }
];

export default function TasksPage() {
  const { tasks, updateTaskStatus } = useAppContext();

  return (
    <>
      <PageHeader title="Task Execution Board" subtitle="Kanban flow auto-filled from meeting intelligence outputs." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <section key={column.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
            <h3 className="font-heading text-xl text-dark">{column.label}</h3>
            <div className="mt-3 space-y-3">
              {tasks
                .filter((task) => task.status === column.key)
                .map((task) => (
                  <article key={task.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.owner}</p>
                    <div className="mt-2 flex gap-2">
                      {columns.map((next) => (
                        <button
                          key={next.key}
                          onClick={() => updateTaskStatus(task.id, next.key)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                        >
                          {next.label}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
