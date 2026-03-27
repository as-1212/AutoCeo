import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import FloatingAssistant from "./FloatingAssistant";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-bg font-body text-slate-800">
      <Sidebar />
      <main className="relative flex-1 p-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <Outlet />
        </motion.div>
      </main>
      <FloatingAssistant />
    </div>
  );
}
