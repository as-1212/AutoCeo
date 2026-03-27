export const hrOnboardingWorkflow = {
  id: "workflow-hr-onboarding",
  name: "HR Onboarding Pipeline",
  steps: [
    { id: "step-1", title: "Collect candidate documents", owner: "HR", status: "pending" },
    { id: "step-2", title: "Provision IT accounts", owner: "IT", status: "pending" },
    { id: "step-3", title: "Schedule orientation session", owner: "People Ops", status: "pending" },
    { id: "step-4", title: "Assign buddy and manager check-in", owner: "Manager", status: "pending" }
  ]
};

export const sampleMeetingNotes = `
Hiring sync:
- Priya will finalize laptop procurement by Wednesday.
- IT must create Slack, email and Jira access before Day 1.
- Rahul to prepare 30-60-90 onboarding plan.
- Follow-up with legal team on NDA signature status.
`;
