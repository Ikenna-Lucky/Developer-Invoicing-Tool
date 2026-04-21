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
    label: "PDF generation",
    title: "Polished PDFs, instantly",
    desc: "Every invoice auto-renders into a branded PDF — professional layout, itemised line items, your details. No design work.",
  },
  {
    icon: CreditCard,
    label: "Stripe payments",
    title: "Clients pay in one click",
    desc: "A Stripe payment link is embedded in every invoice email. Your client pays, you get notified, the invoice marks itself paid.",
  },
  {
    icon: Mail,
    label: "Email delivery",
    title: "Delivered via Resend",
    desc: "Send invoices directly from the dashboard. Track delivery and opens without leaving Billd — powered by Resend.",
  },
  {
    icon: Bell,
    label: "Overdue alerts",
    title: "Nothing slips through",
    desc: "A nightly job scans for overdue invoices and pings you immediately. Stop manually checking what's been paid.",
  },
  {
    icon: Shield,
    label: "Security",
    title: "Secure by default",
    desc: "httpOnly JWT cookies, bcrypt-hashed passwords, and row-level data isolation. Your client data is yours — full stop.",
  },
  {
    icon: BarChart3,
    label: "Dashboard",
    title: "Revenue at a glance",
    desc: "Total earned, pending balance, overdue count — surfaced immediately on login. No reports to dig through.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-28 bg-[#0a0f1e] border-y border-white/[0.06]"
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
          <span className="inline-block text-[11px] font-semibold text-blue-400 uppercase tracking-widest mb-4 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
            Features
          </span>
          <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-tight">
            The invoicing stack, minus the bloat
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
            PDF generation, email delivery, Stripe payments, and overdue alerts
            — everything that matters, nothing you don&apos;t need.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-6 transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Subtle inner glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(ellipse at 20% 20%, rgba(37,99,235,0.06), transparent 60%)",
                }}
              />

              {/* Icon */}
              <div className="relative w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.1] flex items-center justify-center mb-5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300">
                <feature.icon
                  size={18}
                  className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                />
              </div>

              {/* Label */}
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1.5">
                {feature.label}
              </p>

              <h3 className="font-display font-semibold text-white mb-2 text-[15px] leading-snug">
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
          