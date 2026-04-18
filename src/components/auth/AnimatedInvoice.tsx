"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const pop = {
  hidden: { opacity: 0, scale: 0.75 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const rows = [
  { desc: "Frontend Development", detail: "40 hrs @ $80/hr", amount: "$3,200.00" },
  { desc: "UI / UX Design",       detail: "16 hrs @ $80/hr", amount: "$1,280.00" },
  { desc: "API Integration",      detail: "8 hrs @ $80/hr",  amount: "$640.00"   },
];

export function AnimatedInvoice() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
    >
      {/* Invoice top bar */}
      <motion.div variants={fadeUp} className="bg-brand-600 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Invoice</p>
          <p className="text-white font-mono font-bold text-lg tracking-tight">#INV-0042</p>
        </div>
        <motion.span
          variants={pop}
          className="bg-green-400 text-green-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
        >
          ✓ Paid
        </motion.span>
      </motion.div>

      <div className="px-6 py-5">

        {/* Dates row */}
        <motion.div variants={fadeUp} className="flex gap-8 mb-5">
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
            <p className="text-xs font-semibold text-gray-700 font-mono">Apr 15, 2026</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
            <p className="text-xs font-semibold text-gray-700 font-mono">Apr 30, 2026</p>
          </div>
        </motion.div>

        {/* Bill to */}
        <motion.div variants={fadeUp} className="mb-5 pb-5 border-b border-gray-100">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5">Bill To</p>
          <p className="text-sm font-bold text-gray-900">Acme Corporation</p>
          <p className="text-xs text-gray-400">billing@acme.com</p>
        </motion.div>

        {/* Line items */}
        <div className="space-y-3 mb-5">
          {rows.map((row) => (
            <motion.div key={row.desc} variants={fadeUp} className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-800">{row.desc}</p>
                <p className="text-[10px] text-gray-400 font-mono">{row.detail}</p>
              </div>
              <p className="text-xs font-mono font-semibold text-gray-800 shrink-0 ml-4">{row.amount}</p>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <motion.div variants={fadeUp} className="border-t-2 border-gray-900 pt-3 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">Total</p>
          <p className="font-mono font-bold text-gray-900">$5,120.00</p>
        </motion.div>

        {/* Paid stamp */}
        <motion.div
          variants={pop}
          className="mt-4 w-full border-2 border-dashed border-green-300 rounded-xl py-2 text-center"
        >
          <p className="text-[10px] font-bold text-green-600 tracking-[0.2em] uppercase">
            Payment Received — Apr 28, 2026
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
