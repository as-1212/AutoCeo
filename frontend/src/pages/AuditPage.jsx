import { Fragment, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useAppContext } from "../context/AppContext";

export default function AuditPage() {
  const { audit } = useAppContext();
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <PageHeader title="Audit Log" subtitle="Agent decisions with explainable reasoning and confidence records." />
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">Agent</th>
                <th className="px-2 py-2">Decision</th>
                <th className="px-2 py-2">Reason</th>
                <th className="px-2 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {audit.slice(0, 20).map((entry) => (
                <Fragment key={entry.id}>
                  <tr className="border-b border-slate-100">
                    <td className="px-2 py-2">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                    <td className="px-2 py-2 capitalize">{entry.agent}</td>
                    <td className="px-2 py-2">{entry.action}</td>
                    <td className="px-2 py-2">
                      <button className="rounded-lg bg-slate-100 px-2 py-1" onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
                        {expanded === entry.id ? "Collapse" : "Expand"}
                      </button>
                    </td>
                    <td className="px-2 py-2">{entry.payload?.confidence ? `${Math.round(entry.payload.confidence * 100)}%` : "n/a"}</td>
                  </tr>
                  {expanded === entry.id && (
                    <tr className="bg-slate-50">
                      <td className="px-2 py-2 text-xs text-slate-700" colSpan={5}>
                        <pre className="whitespace-pre-wrap">{JSON.stringify(entry.payload, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
