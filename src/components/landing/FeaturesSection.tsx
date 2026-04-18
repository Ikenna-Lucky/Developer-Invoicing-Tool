"use client";

import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  Mail,
  Bell,
  Shield,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    gradient: "from-blue-500 to-indigo-600",
    glow: "group-hover:shadow-blue-200",
    title: "Auto-generated PDFs",
    desc: "Every invoice instantly converts to a polished PDF. Professional layout, your branding — zero design work needed.",
  },
  {
    icon: CreditCard,
    gradient: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-200",
    title: "Stripe payments",
    desc: "Clients pay directly from the invoice link. Stripe handles security and compliance — you just receive the money.",
  },
  {
    icon: Mail,
    gradient: "from-violet-500 to-purple-600",
    glow: "group-hover:shadow-violet-200",
    title: "Email delivery",
    desc: "Send invoices to clients in one click via Resend. Track opens and delivery without leaving the dashboard.",
  },
  {
    icon: Bell,
    gradient: "from-orange-500 to-red-500",
    glow: "group-hover:shadow-orange-200",
    title: "Overdue alerts",
    desc: "Automatic nightly checks flag overdue invoices and send you a notification so nothing slips through the cracks.",
  },
  {
    icon: Shield,
    gradient: "from-slate-600 to-slate-800",
    glow: "group-hover:shadow-slate-200",
    title: "Secure by default",
    desc: "JWT auth with httpOnly cookies, bcrypt passwords, and row-level security — your data is yours alone.",
  },
  {
    icon: BarChart3,
    gradient: "from-pink-500 to-rose-600",
    glow: "group-hover:shadow-pink-200",
    title: "Dashboard insights",
    desc: "See your total earned, pending payments, and overdue invoices at a glance from one clean dashboard.",
  },
];

// Scroll-triggered fade-up for each card with stagger
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-gray-50 border-y border-gray-100"
    >
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
            Features
          </span>
          <h2 className="font-display text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Everything you need to get paid
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Built for developers who want a professional billing workflow
            without the enterprise price tag.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative bg-white rounded-2xl border border-gray-200 p-6
                          shadow-sm hover:shadow-xl hover:shadow-gray-200/60 ${feature.glow}
                          transition-shadow duration-300 cursor-default overflow-hidden`}
            >
              {/* Subtle gradient background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${feature.gradient.replace("from-", "").replace("to-", ", ")})`,
                }}
              />

              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl bg-linear-to-br ${feature.gradient}
                               flex items-center justify-center mb-5 shadow-sm
                               group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={20} className="text-white" />
              </div>

              <h3 className="font-display font-semibold text-gray-900 mb-2 text-[15px]">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
