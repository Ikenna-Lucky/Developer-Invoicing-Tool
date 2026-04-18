/**
 * DASHBOARD LAYOUT
 *
 * In Next.js App Router, a `layout.tsx` file wraps all pages in the same
 * directory and subdirectories. Because this file is inside the `(dashboard)`
 * route group, it applies to /dashboard, /clients, /invoices, and /settings
 * — but NOT to / (landing) or /sign-in, /sign-up (auth pages).
 *
 * The route group name `(dashboard)` with parentheses is just an organisational
 * folder — it does NOT appear in the URL. So `(dashboard)/clients/page.tsx`
 * is still served at the URL `/clients`.
 *
 * This layout renders the Sidebar on the left and a main content area
 * on the right. The `ml-64` on the main element offsets it to the right
 * by the same width as the fixed sidebar (256px / w-64).
 */

import { Sidebar } from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        {/* Main area — offset by sidebar width */}
        <main className="ml-64 min-h-screen flex flex-col">
          <div className="flex-1 p-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
