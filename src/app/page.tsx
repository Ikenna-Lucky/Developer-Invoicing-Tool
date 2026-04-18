import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-xl font-bold text-brand-600">InvoiceDev</span>
        <div className="flex gap-4">
          <Link href="/sign-in" className="btn-secondary">Sign in</Link>
          <Link href="/sign-up" className="btn-primary">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Invoice your clients.<br />
          <span className="text-brand-600">Get paid faster.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          The clean, no-fuss invoicing tool built for freelancers and developers.
          Add clients, log hours, auto-generate a PDF, send it — and get paid via Stripe.
        </p>
        <Link href="/sign-up" className="btn-primary text-base px-8 py-3">
          Start for free — no credit card needed
        </Link>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "📄",
            title: "Auto-generated PDFs",
            desc: "Every invoice becomes a beautiful PDF, automatically.",
          },
          {
            icon: "💳",
            title: "Stripe payments",
            desc: "Clients pay directly from the invoice — no chasing needed.",
          },
          {
            icon: "📬",
            title: "Email delivery",
            desc: "Send invoices to clients with one click via Resend.",
          },
        ].map((f) => (
          <div key={f.title} className="card text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
