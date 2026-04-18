"use client";

import { motion } from "framer-motion";
import { UserPlus, FilePlus, Send, DollarSign } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Add your clients",
    desc: "Store your client's name, email, company, and address. Takes under 30 seconds.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-600",
  },
  {
    icon: FilePlus,
    number: "02",
    title: "Create an invoice",
    desc: "Log your work items, set your rate per hour or unit, and choose a due date.",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    iconBg: "bg-violet-600",
  },
  {
    icon: Send,
    number: "03",
    title: "Send the PDF",
    desc: "We generate a professional PDF and email it to your client in one click.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconBg: "bg-emerald-600",
  },
  {
    icon: DollarSign,
    number: "04",
    title: "Get paid via Stripe",
    desc: "Your client clicks the payment link in the email and pays securely. Invoice marks as paid automatically.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    iconBg: "bg-orange-500",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-brand-600 uppercase tracking-widest mb-4 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            How it works
          </span>
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            From signup to getting paid
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Four simple steps. No learning curve, no complicated setup.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon bubble */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`relative w-20 h-20 rounded-2xl ${step.color} border-2
                               flex items-center justify-center mb-5 shadow-sm`}
                >
                  <step.icon size={28} />
                  {/* Step number badge */}
                  <span className={`absolute -top-2.5 -right-2.5 w-6 h-6 ${step.iconBg}
                                    text-white text-[10px] font-bold rounded-full
                                    flex items-center justify-center shadow-sm`}>
                    {i + 1}
                  </span>
                </motion.div>

                <h3 className="font-display font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
