import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * LANDING PAGE
 *
 * This is a Server Component by default in Next.js App Router.
 * The individual sections that need animations are Client Components
 * ("use client" at the top of each file), while this root page stays
 * a Server Component — which is the correct Next.js pattern.
 *
 * Server Component = rendered on the server, faster initial page load
 * Client Component = has JavaScript interactivity, runs in the browser
 *
 * You only need "use client" where you actually use hooks or browser APIs.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0d1117" }}>
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
