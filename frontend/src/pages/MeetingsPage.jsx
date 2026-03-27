import { useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

const demoNotes = `- Priya will finalize laptop procurement by Wednesday.
- IT team to create access credentials.
- Rahul to submit onboarding plan to HR.
- Escalate NDA status if legal does not confirm by EOD.`;

export default function MeetingsPage() {
  const { extractFromMeeting, createTasksFromMeeting, meetingOutput, loading } = useAppContext();
  const [notes, setNotes] = useState(demoNotes);

  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNotes(String(reader.result || ""));
    reader.readAsText(file);
  };

  return (
    <>
      <PageHeader title="Meeting Intelligence System" subtitle="Upload transcript/audio text, extract decisions, tasks, and owners." />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium">
        <label className="text-sm font-medium text-slate-600">Upload transcript/audio (text)</label>
        <input className="mt-2 w-full rounded-xl border border-slate-200 p-2" type="file" accept=".txt,.md,.csv" onChange={onFile} />
        <textarea
          className="mt-3 h-40 w-full rounded-xl border border-slate-200 p-3 text-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => extractFromMeeting(notes)}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            disabled={loading.extract}
          >
            {loading.extract ? "AI is thinking..." : "Extract Insights"}
          </button>
          <button onClick={createTasksFromMeeting} className="rounded-xl bg-dark px-4 py-2 text-sm font-semibold text-white">
            Create Tasks
          </button>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
          <h3 className="font-heading text-xl">Decisions</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {meetingOutput.decisions.map((d, idx) => (
              <li key={idx}>{d}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
          <h3 className="font-heading text-xl">Tasks</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {meetingOutput.tasks.map((task) => (
              <li key={task.id}>{task.text}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
          <h3 className="font-heading text-xl">Owners</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {meetingOutput.owners.map((owner, idx) => (
              <li key={idx}>{owner}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
