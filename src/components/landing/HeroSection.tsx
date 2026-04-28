"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/80 pointer-events-none" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 pt-36 pb-20 sm:pt-28 sm:pb-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/85 text-[11px] sm:text-xs font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8 shadow-sm">
              <Zap size={11} className="fill-blue-400 text-blue-400" />
              Built for freelancers · Open source on GitHub
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-white tracking-tight leading-[1.06] mb-5 sm:mb-6 max-w-4xl"
            style={{ fontSize: "clamp(2.4rem, 10vw, 4.5rem)" }}
          >
            Invoice clients.{" "}
            <br className="hidden xs:block" />
            <span className="gradient-text">Get paid faster.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-[15px] sm:text-lg lg:text-xl text-white/60 max-w-xs sm:max-w-lg leading-relaxed mb-8 sm:mb-10"
          >
            Stop chasing payments. Billd turns your work into a polished
            invoice, emails it to your client, and collects payments —
            automatically.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-7 py-4 sm:py-3.5 rounded-xl shadow-xl shadow-black/30 hover:bg-gray-50 transition-all duration-200 text-[15px] sm:text-sm w-full sm:w-auto"
              >
                Send your first invoice free
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-4 sm:py-3.5 rounded-xl border border-white/20 transition-all duration-200 text-[15px] sm:text-sm w-full sm:w-auto"
              >
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust line */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11px] sm:text-xs text-white/40"
          >
            {[
              "First invoice in under 60 seconds",
              "Secure payments",
              "MIT licensed · always free",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-400/80 shrink-0" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — hidden on small screens to save space */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-white/30"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
