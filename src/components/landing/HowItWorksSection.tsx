"use client";

import { motion } from "framer-motion";
import { UserPlus, FilePlus, Send, DollarSign } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Add a client",
    desc: "Name, email, company. Under 30 seconds — then they're saved for every future invoice.",
  },
  {
    icon: FilePlus,
    number: "02",
    title: "Build the invoice",
    desc: "Add line items, set your rate, pick a due date. Billd calculates the total and formats everything.",
  },
  {
    icon: Send,
    number: "03",
    title: "Send the PDF",
    desc: "One click emails your client a polished PDF with a Stripe payment link embedded inside.",
  },
  {
    icon: DollarSign,
    number: "04",
    title: "Get paid",
    desc: "Client pays via Stripe. Invoice marks itself paid. You get notified. Nothing to chase.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 overflow-hidden" style={{ background: "#0d1117" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{
              color: "#60a5fa",
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            How it works
          </span>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-4xl font-bold tracking-tight max-w-lg leading-tight text-white">
              From signed off to money in.
            </h2>
            <p className="max-w-4xl text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Most users send their first invoice within 5 minutes of signing
              up. Here&apos;s how it flows.
            </p>
          </div>
        </motion.div>

        {/* Steps */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative p-8 flex flex-col transition-colors duration-300"
              style={{ background: "#161b27" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a2035")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#161b27")}
            >
              {/* Large ghost number */}
              <span
                className="font-display text-[5rem] font-bold leading-none select-none mb-4 -ml-1 transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.05)" }}
              >
                {step.number}
              </span>

              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 transition-colors duration-300 group-hover:scale-110 transform"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                <step.icon size={16} className="text-white" />
              </div>

              <h3 className="font-display font-semibold mb-2 text-base text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {step.desc}
              </p>

              {/* Arrow connector — hidden on last */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10
                              w-6 h-6 rounded-full items-center justify-center"
                  style={{ background: "#1a2035", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M3 2l4 3-4 3"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
