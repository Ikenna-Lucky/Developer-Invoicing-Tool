"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";

// Stagger helper — delays each child animation slightly so they don't all
// animate at the exact same time. Creates a much more polished "cascade" feel.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Fake app preview data shown in the mockup
const mockClients = [
  { name: "Acme Corp",     email: "billing@acme.com",    amount: "$4,200", status: "Paid",    color: "bg-green-100 text-green-700" },
  { name: "TechFlow Inc",  email: "accounts@techflow.io", amount: "$1,850", status: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { name: "Studio Nova",   email: "pay@studionova.co",    amount: "$950",   status: "Sent",    color: "bg-blue-100 text-blue-700"   },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

      {/* ── Background: dot grid + animated blobs ── */}
      <div className="absolute inset-0 bg-dot-grid opacity-60" />

      {/* Blob 1 — blue */}
      <div
        className="animate-blob absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, #7c3aed)" }}
      />
      {/* Blob 2 — indigo, delayed */}
      <div
        className="animate-blob animation-delay-2 absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, #ec4899)", filter: "blur(60px)" }}
      />
      {/* Blob 3 — cyan, delayed more */}
      <div
        className="animate-blob animation-delay-4 absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #06b6d4, #3b82f6)", filter: "blur(80px)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >

          {/* ── Badge ── */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
              <Zap size={12} className="fill-brand-600 text-brand-600" />
              Open source · Free to use · No credit card needed
            </div>
          </motion.div>

          {/* ── Headline ── */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6 max-w-4xl"
          >
            Invoice clients.{" "}
            <span className="gradient-text">Get paid faster.</span>
          </motion.h1>

          {/* ── Subtext ── */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10"
          >
            The professional invoicing tool built for freelancers and developers.
            Auto-generate PDFs, send by email, and collect Stripe payments — all in one place.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700
                           text-white font-semibold px-8 py-3.5 rounded-xl
                           shadow-lg shadow-brand-500/25 transition-all text-sm"
              >
                Start invoicing for free
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              Already have an account? <span className="text-brand-600 font-semibold">Sign in →</span>
            </Link>
          </motion.div>

          {/* ── Trust bullets ── */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 mb-16"
          >
            {["No credit card required", "Free forever plan", "Open source"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-500" />
                {item}
              </span>
            ))}
          </motion.div>

          {/* ── App mockup ── */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-4xl animate-float"
          >
            {/* Browser chrome */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-300/40 overflow-hidden">
              {/* Browser top bar */}
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                  app.invoicedev.io/clients
                </div>
              </div>

              {/* App shell inside browser */}
              <div className="flex h-64 sm:h-80">
                {/* Fake sidebar */}
                <div className="w-48 border-r border-gray-100 bg-white flex flex-col p-3 gap-0.5 shrink-0 hidden sm:flex">
                  <div className="flex items-center gap-2 px-3 py-2 mb-2">
                    <div className="w-6 h-6 bg-brand-600 rounded-lg" />
                    <span className="font-display font-bold text-xs text-gray-800">InvoiceDev</span>
                  </div>
                  {["Dashboard", "Clients", "Invoices", "Settings"].map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                        i === 1 ? "bg-brand-50 text-brand-700" : "text-gray-500"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-sm ${i === 1 ? "bg-brand-400" : "bg-gray-200"}`} />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Fake content */}
                <div className="flex-1 bg-gray-50 p-4 sm:p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="h-5 w-20 bg-gray-900 rounded font-display font-bold text-sm flex items-center">
                        <span className="text-gray-900 text-sm font-bold ml-1">Clients</span>
                      </div>
                      <div className="h-2.5 w-32 bg-gray-200 rounded mt-1" />
                    </div>
                    <div className="bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                      + Add Client
                    </div>
                  </div>

                  {/* Fake table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-3 sm:grid-cols-4 px-4 py-2 bg-gray-50 border-b border-gray-100">
                      {["Client", "Email", "Amount", "Status"].map((h) => (
                        <span key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide hidden sm:block first:block">{h}</span>
                      ))}
                    </div>
                    {mockClients.map((c, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 sm:grid-cols-4 px-4 py-3 border-b last:border-0 border-gray-100 items-center"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {c.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                          </div>
                          <span className="text-xs font-semibold text-gray-800 hidden sm:block">{c.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 hidden sm:block truncate">{c.email}</span>
                        <span className="text-xs font-mono font-semibold text-gray-800">{c.amount}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${c.color}`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
