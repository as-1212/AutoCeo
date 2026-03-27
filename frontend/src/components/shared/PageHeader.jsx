export default function PageHeader({ title, subtitle }) {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium">
      <h2 className="font-heading text-3xl text-dark">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </header>
  );
}
