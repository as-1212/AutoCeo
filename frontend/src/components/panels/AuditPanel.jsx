import { Fragment, useState } from "react";

export default function AuditPanel({ audit }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="card">
      <h3>Audit Log System</h3>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Agent</th>
            <th>Decision</th>
            <th>Reasoning</th>
          </tr>
        </thead>
        <tbody>
          {(audit || []).slice(0, 12).map((entry) => (
            <Fragment key={entry.id}>
              <tr>
                <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                <td>{entry.agent}</td>
                <td>{entry.action}</td>
                <td>
                  <button className="ghost-btn" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                    {expandedId === entry.id ? "Hide" : "Expand"}
                  </button>
                </td>
              </tr>
              {expandedId === entry.id && (
                <tr className="audit-expanded">
                  <td colSpan={4}>
                    <pre>{JSON.stringify(entry.payload, null, 2)}</pre>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}
