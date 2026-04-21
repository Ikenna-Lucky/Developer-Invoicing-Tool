import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/ui/CommandPalette";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ background: "#0d1117" }}>
        <Sidebar />
        <div className="ml-64 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1">
            <div className="px-10 py-10 max-w-[1280px]">
              {children}
            </div>
          </main>
        </div>
        <CommandPalette />
      </div>
    </ToastProvider>
  );
}
