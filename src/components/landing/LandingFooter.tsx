import Link from "next/link";
import { Receipt } from "lucide-react";

const footerLinks = {
  Product:   [{ label: "Features", href: "#features" }, { label: "How it works", href: "#how-it-works" }, { label: "Changelog", href: "#" }],
  Developer: [{ label: "GitHub", href: "#" }, { label: "Documentation", href: "#" }, { label: "API Reference", href: "#" }],
  Legal:     [{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }],
};

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
                <Receipt size={15} className="text-white" />
              </div>
              <span className="font-display font-bold text-gray-900 text-[15px] tracking-tight">InvoiceDev</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">
              The professional invoicing tool built for developers.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-display font-semibold text-xs text-gray-900 uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} InvoiceDev. Open source under the MIT License.
          </p>
          <p className="text-xs text-gray-400">
            Built with Next.js, Hono, and ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
