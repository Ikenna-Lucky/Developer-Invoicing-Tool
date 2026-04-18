import { Github } from "lucide-react";
import { BilldLogo } from "@/components/ui/BilldLogo";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <BilldLogo href="/" size="sm" />

        {/* Copyright */}
        <p className="text-xs text-gray-400 order-last sm:order-none">
          © {new Date().getFullYear()} Billd. Open source under the MIT License.
        </p>

        {/* Links */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Terms
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Github size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
