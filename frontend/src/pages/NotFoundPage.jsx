import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-premium">
      <h2 className="font-heading text-3xl text-dark">Page Not Found</h2>
      <Link className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white" to="/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );
}
