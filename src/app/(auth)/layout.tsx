import { BilldLogo } from "@/components/ui/BilldLogo";
import { AnimatedInvoice } from "@/components/auth/AnimatedInvoice";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[54%] flex-col p-10 relative overflow-hidden bg-[#0a0f1e]">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -left-20 w-[560px] h-[560px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,0.35), transparent)",
              filter: "blur(100px)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(109,40,217,0.2), transparent)",
              filter: "blur(90px)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,0.08), transparent)",
              filter: "blur(60px)",
            }}
          />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Subtle horizontal separator at top and bottom */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />

        {/* Logo */}
        <div className="relative z-10 mb-auto">
          <BilldLogo href="/" size="md" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-10 py-8">
          {/* Headline */}
          <div className="text-center max-w-sm">
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-full px-3.5 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                Free forever · No credit card
              </span>
            </div>
            <h2 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] tracking-tight mb-3">
              Send invoices.
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                }}
              >
                Get paid faster.
              </span>
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Professional invoices, automated reminders, and Stripe payments —
              built for developers.
            </p>
          </div>

          {/* Animated invoice */}
          <AnimatedInvoice />
        </div>

        {/* Bottom */}
        <div className="relative z-10 mt-auto flex items-center justify-between">
          <p className="text-[11px] text-gray-700">© 2026 Billd</p>
          <p className="text-[11px] text-gray-700">Open source · MIT License</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full lg:w-[46%] flex flex-col items-center justify-center bg-white px-8 py-12 min-h-screen relative">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-600 lg:hidden" />

        {/* Logo on mobile */}
        <div className="flex justify-center mb-10 lg:hidden">
          <BilldLogo href="/" size="md" />
        </div>

        <div className="w-full max-w-[380px]">{children}</div>
      </div>
    </div>
  );
}
