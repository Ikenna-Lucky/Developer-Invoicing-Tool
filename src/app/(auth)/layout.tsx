import { BilldLogo } from "@/components/ui/BilldLogo";
import { AnimatedInvoice } from "@/components/auth/AnimatedInvoice";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — dark, branded, animated invoice ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden bg-gray-950">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, #1d4ed8, transparent)", filter: "blur(120px)", opacity: 0.4 }} />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, #6d28d9, transparent)", filter: "blur(100px)", opacity: 0.3 }} />
          <div className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <BilldLogo href="/" size="md" />
        </div>

        {/* Center — headline + invoice */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-white leading-tight tracking-tight mb-3">
              Send invoices.<br />
              <span className="text-brand-400">Get paid in minutes.</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Generate professional invoices, email them directly, and accept Stripe payments — all from one place.
            </p>
          </div>
          <AnimatedInvoice />
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-xs text-gray-700">Open source · Free forever · MIT License</p>
        </div>
      </div>

      {/* ── Right panel — clean form ── */}
      <div className="w-full lg:w-[48%] flex flex-col items-center justify-center bg-white px-8 py-12 min-h-screen">

        {/* Logo on mobile only */}
        <div className="flex justify-center mb-10 lg:hidden">
          <BilldLogo href="/" size="md" />
        </div>

        <div className="w-full max-w-[360px]">
          {children}
        </div>
      </div>

    </div>
  );
}
