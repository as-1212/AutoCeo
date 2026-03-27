import { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState("Run onboarding workflow with compliance focus");
  const [messages, setMessages] = useState([]);
  const { runWorkflow, loading } = useAppContext();

  const handleRun = async () => {
    if (!goal.trim()) return;
    const result = await runWorkflow(goal);
    setMessages((prev) => [
      { who: "You", text: goal },
      { who: "AutoCEO", text: `Planner created ${result.planner.plan.length} steps.` },
      ...prev
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="mb-3 w-80 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-premium backdrop-blur-md"
        >
          <h4 className="font-heading text-lg text-dark">AI Assistant</h4>
          <p className="text-xs text-slate-600">Cross-page orchestration and planning.</p>
          <input
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button
            className="mt-2 w-full rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            onClick={handleRun}
            disabled={loading.run}
          >
            {loading.run ? "AI is thinking..." : "Execute"}
          </button>
          <div className="mt-3 max-h-44 space-y-2 overflow-auto">
            {messages.map((m, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 p-2 text-xs text-slate-700">
                <strong>{m.who}:</strong> {m.text}
              </div>
            ))}
          </div>
        </motion.div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-premium"
      >
        {open ? "Close AI" : "Ask AI"}
      </button>
    </div>
  );
}
