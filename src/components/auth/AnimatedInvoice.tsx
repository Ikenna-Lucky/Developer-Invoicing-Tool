"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const stamp = {
  hidden: { opacity: 0, scale: 1.4, rotate: -12 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: -12,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 1.9 },
  },
};

const badge = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 2.2 },
  },
};

const rows = [
  {
    desc: "Frontend Development",
    hrs: "40h",
    rate: "$80",
    amount: "$3,200.00",
  },
  { desc: "UI / UX Design", hrs: "16h", rate: "$80", amount: "$1,280.00" },
  { desc: "API Integration", hrs: "8h", rate: "$80", amount: "$640.00" },
];

export function AnimatedInvoice() {
  return (
    <div className="relative w-full max-w-[370px]">
      {/* Floating payment notification */}
      <motion.div
        variants={badge}
        initial="hidden"
        animate="show"
        className="absolute -top-5 -right-5 z-20 bg-white rounded-2xl px-3.5 py-2.5
                   flex items-center gap-2.5 shadow-2xl shadow-black/25 border border-gray-100"
      >
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle size={14} className="text-green-500" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">
            Payment received
          </p>
          <p className="text-[10px] text-gray-400 font-mono">
            $5,120.00 · just now
          </p>
        </div>
      </motion.div>

      {/* Invoice document */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
      >
        {/* Brand accent bar */}
        <div className="h-1 w-full bg-brand-600" />

        {/* Invoice header */}
        <motion.div
          variants={fadeUp}
          className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-gray-100"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-5 h-5 bg-brand-600 rounded flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-800 tracking-tight">
                Billd
              </span>
            </div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">
              Invoice
            </p>
            <p className="font-mono font-bold text-gray-900">#INV-0042</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">
                Issued
              </p>
              <p className="font-mono text-[11px] text-gray-700">
                Apr 15, 2026
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">
                Due
              </p>
              <p className="font-mono text-[11px] text-gray-700">
                Apr 30, 2026
              </p>
            </div>
          </div>
        </motion.div>

        {/* From / Bill To */}
        <motion.div
          variants={fadeUp}
          className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-gray-100"
        >
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5">
              From
            </p>
            <p className="text-xs font-semibold text-gray-900">Ikenna Obi</p>
            <p className="text-[10px] text-gray-400">hello@billd.dev</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5">
              Bill To
            </p>
            <p className="text-xs font-semibold text-gray-900">
              Acme Corporation
            </p>
            <p className="text-[10px] text-gray-400">billing@acme.com</p>
          </div>
        </motion.div>

        {/* Line items */}
        <div className="px-6 pt-4 pb-2">
          {/* Table header */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-[1fr_28px_36px_64px] gap-x-2 pb-2 border-b border-gray-100 mb-1"
          >
            {["Item", "Hrs", "Rate", "Amount"].map((h) => (
              <p
                key={h}
                className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest text-right first:text-left"
              >
                {h}
              </p>
            ))}
          </motion.div>

          {/* Rows */}
          {rows.map((row) => (
            <motion.div
              key={row.desc}
              variants={fadeUp}
              className="grid grid-cols-[1fr_28px_36px_64px] gap-x-2 py-2.5 border-b border-gray-50 last:border-0"
            >
              <p className="text-[11px] font-medium text-gray-800 truncate">
                {row.desc}
              </p>
              <p className="text-[11px] font-mono text-gray-400 text-right">
                {row.hrs}
              </p>
              <p className="text-[11px] font-mono text-gray-400 text-right">
                {row.rate}
              </p>
              <p className="text-[11px] font-mono font-semibold text-gray-800 text-right">
                {row.amount}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <motion.div
          variants={fadeUp}
          className="px-6 pt-3 pb-5 space-y-1.5 border-t border-gray-100"
        >
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Subtotal</span>
            <span className="font-mono">$5,120.00</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Tax (0%)</span>
            <span className="font-mono">$0.00</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-gray-900 pt-2 border-t border-gray-100 mt-1">
            <span>Total</span>
            <span className="font-mono">$5,120.00</span>
          </div>
        </motion.div>

        {/* Paid stamp */}
        <motion.div
          variants={stamp}
          initial="hidden"
          animate="show"
          className="absolute bottom-12 right-4 pointer-events-none"
          style={{ transformOrigin: "center" }}
        >
          <div
            className="px-3 py-1.5 rounded-lg border-2 border-green-400 text-green-400
                       text-[14px] font-black uppercase tracking-widest opacity-70"
          >
            PAID
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
