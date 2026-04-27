"use client";

import { Github } from "lucide-react";
import { BilldLogo } from "@/components/ui/BilldLogo";

export function LandingFooter() {
  return (
    <footer
      className="py-8"
      style={{
        background: "#0a0f1e",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <BilldLogo href="/" size="sm" />

        {/* Copyright */}
        <p className="text-xs order-last sm:order-none" style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} Billd. Open source under the MIT License.
        </p>

        {/* Links */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            Terms
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            <Github size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
