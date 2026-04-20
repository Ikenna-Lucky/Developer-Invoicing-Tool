import { Sidebar } from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ background: "#0d1117" }}>
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <div className="px-10 py-10 max-w-[1280px]">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
