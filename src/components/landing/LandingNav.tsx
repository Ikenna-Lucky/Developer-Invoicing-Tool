"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { BilldLogo } from "@/components/ui/BilldLogo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#cta" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating pill — centered, not full-width */}
      <div className="fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center gap-1 p-4 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-xl shadow-black/10"
              : "bg-black/25 backdrop-blur-md border border-white/15"
          }`}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400 }} className="pl-1 pr-2">
            <BilldLogo href="/" size="sm" />
          </motion.div>

          {/* Divider */}
          <div
            className={`hidden md:block w-px h-4 mx-1 transition-colors duration-300 ${
              scrolled ? "bg-gray-200" : "bg-white/20"
            }`}
          />

          {/* Nav links */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  scrolled
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div
            className={`hidden md:block w-px h-4 mx-1 transition-colors duration-300 ${
              scrolled ? "bg-gray-200" : "bg-white/20"
            }`}
          />

          {/* CTA group */}
          <div className="hidden md:flex items-center gap-1 pl-1">
            <Link
              href="/sign-in"
              className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}
            >
              Sign in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-up"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  scrolled
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                Get started
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden ml-1 p-2 rounded-full transition-colors duration-200 ${
              scrolled
                ? "text-gray-600 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>

        {/* Mobile dropdown — drops below the pill */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 mx-4"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-xl shadow-black/10 overflow-hidden">
                <div className="p-2 space-y-0.5">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    href="/sign-in"
                    className="btn-secondary w-full justify-center text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="btn-primary w-full justify-center text-sm"
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
