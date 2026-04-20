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
    <section id="how-it-works" className="py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <span className="inline-block text-[11px] font-semibold text-brand-600 uppercase tracking-widest mb-4 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            How it works
          </span>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-4xl font-bold text-gray-900 tracking-tight max-w-lg leading-tight">
              From signed off to money in.
            </h2>
            <p className="text-gray-400 max-w-4xl text-base leading-relaxed">
              Most users send their first invoice within 5 minutes of signing
              up. Here&apos;s how it flows.
            </p>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
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
              className="group relative bg-white p-8 hover:bg-gray-50 transition-colors duration-300 flex flex-col"
            >
              {/* Large ghost number */}
              <span
                className="font-display text-[5rem] font-bold leading-none text-gray-100
                               group-hover:text-brand-50 transition-colors duration-300 select-none mb-4 -ml-1"
              >
                {step.number}
              </span>

              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center mb-5
                              group-hover:bg-brand-600 transition-colors duration-300"
              >
                <step.icon size={16} className="text-white" />
              </div>

              <h3 className="font-display font-semibold text-gray-900 mb-2 text-base">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>

              {/* Arrow connector — hidden on last */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10
                                w-6 h-6 bg-white border border-gray-100 rounded-full
                                items-center justify-center shadow-sm"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M3 2l4 3-4 3"
                      stroke="#d1d5db"
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
