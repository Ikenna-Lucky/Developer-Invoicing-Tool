"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { BilldLogo } from "@/components/ui/BilldLogo";

const navLinks = [
  { label: "Features",     href: "#features"    },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing",      href: "#cta"          },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Floating pill */}
      <div className="fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1 p-4 rounded-full"
          style={{
            background: "rgba(10,15,30,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400 }} className="pl-1 pr-2">
            <BilldLogo href="/" size="sm" />
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Nav links */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "white";
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* CTA group */}
          <div className="hidden md:flex items-center gap-1 pl-1">
            <Link
              href="/sign-in"
              className="px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "white";
                (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              Sign in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                Get started
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden ml-1 p-2 rounded-full transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 mx-4"
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(14,20,32,0.96)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                }}
              >
                <div className="p-2 space-y-0.5">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = "white";
                        (e.target as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                        (e.target as HTMLElement).style.background = "transparent";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="p-3 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <Link
                    href="/sign-in"
                    className="w-full text-center py-2.5 text-sm font-semibold rounded-xl transition-colors"
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="w-full text-center py-2.5 text-sm font-semibold rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                  >
                    Get started free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
