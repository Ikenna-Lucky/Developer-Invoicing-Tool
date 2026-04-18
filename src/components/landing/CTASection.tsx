"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

export function CTASection() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-brand-900" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-10" />

      {/* Glow orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #3b82f6, transparent)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-xs font-semibold text-blue-400 uppercase tracking-widest mb-6 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Free forever
          </span>

          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Ready to get paid on time?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join developers who use Billd to send professional invoices,
            automate follow-ups, and collect payments — without the enterprise
            price tag.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-white text-gray-900
                           font-semibold px-7 py-3.5 rounded-xl hover:bg-gray-100
                           transition-colors shadow-lg text-sm"
              >
                Create your free account
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15
                           text-white font-semibold px-7 py-3.5 rounded-xl
                           border border-white/10 transition-colors text-sm"
              >
                <Github size={16} />
                View on GitHub
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
