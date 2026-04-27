"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        aria-hidden="true"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/75 pointer-events-none" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
              <Zap size={12} className="fill-blue-400 text-blue-400" />
              Built for freelancers · Open source on GitHub
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl"
          >
            Invoice clients. <br />
            <span className="gradient-text">Get paid faster.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-white/65 max-w-xl leading-relaxed mb-10"
          >
            Stop chasing payments. Billd turns your work into a polished
            invoice, emails it to your client, and collects Stripe payments —
            automatically.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-black/30 hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                Send your first invoice free
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all duration-200 text-sm"
              >
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust line */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/45"
          >
            {[
              "First invoice in under 60 seconds",
              "Stripe-powered payments",
              "MIT licensed · always free",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-400/80" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-white/30"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium">
            Scroll
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
         