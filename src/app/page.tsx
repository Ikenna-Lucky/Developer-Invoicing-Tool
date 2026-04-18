import Link from "next/link";
import { Receipt, FileText, CreditCard, Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Receipt size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-[15px]">InvoiceDev</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get started free
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-brand-100">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Open source · Free to use
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Invoice clients.<br />
          <span className="text-brand-600">Get paid faster.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The professional invoicing tool built for freelancers and developers.
          Auto-generate PDFs, send by email, and collect payments via Stripe — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm text-sm"
          >
            Start invoicing for free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-3.5 transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to get paid</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Built for developers who want a clean, no-fuss billing workflow without
              paying for an enterprise subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                color: "bg-blue-50 text-blue-600",
                title: "Auto-generated PDFs",
                desc: "Every invoice is instantly converted to a professional PDF — no design skills needed.",
              },
              {
                icon: CreditCard,
                color: "bg-green-50 text-green-600",
                title: "Stripe payments",
                desc: "Clients pay directly from the invoice. Stripe handles the transaction securely.",
              },
              {
                icon: Mail,
                color: "bg-purple-50 text-purple-600",
                title: "Email delivery",
                desc: "Send invoices to clients in one click. We handle delivery via Resend.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">From signup to getting paid in four simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { step: "01", title: "Add your clients",     desc: "Store your client's name, email, and company details." },
              { step: "02", title: "Create an invoice",    desc: "Log your work items, set your rate, and add a due date." },
              { step: "03", title: "Send & get the PDF",   desc: "We generate a PDF and email it to your client instantly." },
              { step: "04", title: "Client pays via Stripe", desc: "Your client clicks the payment link and pays securely online." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-brand-100 hover:bg-brand-50/30 transition-colors">
                <span className="text-2xl font-black text-brand-100 shrink-0 leading-none">{step}</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get paid on time?</h2>
          <p className="text-brand-100 mb-8">
            Join freelancers and developers who use InvoiceDev to manage their billing professionally.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-colors text-sm"
          >
            Create your free account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
              <Receipt size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">InvoiceDev</span>
          </div>
          <p className="text-xs text-gray-400">
            Open source · Built for developers · {new Date().getFullYear()}
          </p>
        </div>
      </footer>

    </main>
  );
}
