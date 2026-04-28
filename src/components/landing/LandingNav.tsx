"use client";

import { useState, useEffect } from "react";
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

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      {/* ── Floating pill navbar ─────────────────────────────────────────────── */}
      <div className="fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1 px-3 py-2.5 rounded-full w-full max-w-[420px] sm:w-auto sm:max-w-none"
          style={{
            background: "rgba(10,15,30,0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.11)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          {/* Logo — grows to fill space on mobile */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="pl-2 pr-2 flex-1 sm:flex-none"
          >
            <BilldLogo href="/" size="sm" />
          </motion.div>

          {/* Desktop divider */}
          <div className="hidden md:block w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Desktop nav links */}
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

          {/* Desktop divider */}
          <div className="hidden md:block w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Desktop CTAs */}
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                Get started <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>

          {/* Mobile: Sign in link + hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            <Link
              href="/sign-in"
              className="text-[13px] font-semibold px-3 py-1.5 rounded-full"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Sign in
            </Link>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
              }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* ── Full-screen mobile menu (slides in from the right) ───────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
              onClick={closeMenu}
            />

            {/* Slide panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[70] flex flex-col"
              style={{ background: "rgba(7, 11, 22, 0.98)", backdropFilter: "blur(32px)" }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div onClick={closeMenu}>
                  <BilldLogo href="/" size="md" />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={closeMenu}
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-5 pt-6 pb-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.32, ease: "easeOut" }}
                    className="flex items-center justify-between px-5 py-5 rounded-2xl text-[20px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                    onTouchStart={(e) => {
                      (e.currentTarget).style.background = "rgba(255,255,255,0.05)";
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        (e.currentTarget).style.background = "transparent";
                      }, 150);
                    }}
                  >
                    <span>{link.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>
                      <ArrowRight size={18} />
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35, ease: "easeOut" }}
                className="px-5 pb-10 pt-5 flex flex-col gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="w-full text-center py-4 text-[16px] font-semibold rounded-2xl transition-colors"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="w-full text-center py-4 text-[16px] font-bold rounded-2xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    boxShadow: "0 6px 28px rgba(37,99,235,0.45)",
                  }}
                >
                  Get started free →
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
