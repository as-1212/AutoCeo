import { useState } from "react";

export default function ChatPanel({ onSend, messages, loading }) {
  const [goal, setGoal] = useState("Run HR onboarding for new hire cohort");

  async function submit(e) {
    e.preventDefault();
    if (!goal.trim()) return;
    await onSend(goal);
  }

  return (
    <section className="card">
      <h3>Agent Chat Interface</h3>
      <form className="row" onSubmit={submit}>
        <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Ask AutoCEO agents..." />
        <button type="submit" disabled={loading}>
          {loading ? "AI thinking..." : "Run"}
        </button>
      </form>
      <div className="chat-log">
        {loading && (
          <div className="chat-item loading">
            <strong>AutoCEO:</strong> Evaluating workflows, risk signals, and escalation paths...
          </div>
        )}
        {messages.map((message, idx) => (
          <div key={idx} className="chat-item">
            <div>
              <strong>{message.role}:</strong> {message.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
