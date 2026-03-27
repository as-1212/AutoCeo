import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/meetings", label: "Meetings" },
  { to: "/tasks", label: "Tasks" },
  { to: "/workflows", label: "Workflows" },
  { to: "/risks", label: "Risks" },
  { to: "/audit", label: "Audit" },
  { to: "/analytics", label: "Analytics" }
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-700/60 bg-gradient-to-b from-dark to-darkSoft px-5 py-6 text-slate-100">
      <h1 className="font-heading text-3xl text-primary">AutoCEO</h1>
      <p className="mt-1 text-xs text-slate-300">Fintech Editorial Command Suite</p>
      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-white/10 text-gold shadow-premium" : "text-slate-200 hover:bg-white/5"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
