import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ToastProvider } from "@/components/ui/Toast";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <div className="min-h-screen" style={{ background: "#0d1117" }}>
          <Sidebar />
          {/* On mobile the sidebar overlays content; on lg+ it pushes it */}
          <div className="lg:ml-64 flex flex-col min-h-screen">
            <DashboardHeader />
            <main className="flex-1">
              <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1280px]">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}
