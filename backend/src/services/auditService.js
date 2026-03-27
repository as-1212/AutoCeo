import { v4 as uuid } from "uuid";

const auditLog = [];

export function addAuditEntry(agent, action, payload = {}) {
  const record = {
    id: uuid(),
    timestamp: new Date().toISOString(),
    agent,
    action,
    payload
  };
  auditLog.unshift(record);
  return record;
}

export function getAuditLog() {
  return auditLog;
}
