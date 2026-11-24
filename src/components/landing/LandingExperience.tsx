import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CirclePlay,
  MailCheck,
  ReceiptText,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { BilldLogo } from "@/components/ui/BilldLogo";

function InvoiceDocument({ compact = false }: { compact?: boolean }) {
  return (
    <article
      className={`invoice-document ${compact ? "invoice-document--compact" : ""}`}
    >
      <header className="invoice-document__header">
        <strong>Billd</strong>
        <span>INVOICE · INV-0043</span>
      </header>
      <div className="invoice-document__parties">
        <div>
          <span>To</span>
          <strong>Lagos Creative Studio</strong>
          <small>hello@lagoscreative.studio</small>
        </div>
        <div>
          <span>Issued</span>
          <strong>20 Jan, 2025</strong>
          <small>Due 03 Feb, 2025</small>
        </div>
      </div>
      <p className="invoice-document__project">
        Brand identity &amp; asset design
      </p>
      <div className="invoice-document__line">
        <span>Brand identity design</span>
        <b>₦750,000</b>
      </div>
      <div className="invoice-document__line">
        <span>Social media asset suite</span>
        <b>₦300,000</b>
      </div>
      <div className="invoice-document__line">
        <span>Final artwork handover</span>
        <b>₦150,000</b>
      </div>
      <footer className="invoice-document__total">
        <span>Total</span>
        <strong>₦1,200,000</strong>
      </footer>
    </article>
  );
}

function LaptopMockup() {
  return (
    <div className="laptop" aria-label="Billd invoice creation screen">
      <div className="laptop__project-note">
        Shipped
        <br />
        <strong>20 Jan</strong>
      </div>
      <div className="laptop__screen">
        <div className="laptop__bar">
          <i />
          <i />
          <i />
          <span>billd.app/invoices/new</span>
        </div>
        <div className="laptop__canvas">
          <InvoiceDocument compact />
        </div>
        <button className="laptop__send">Send invoice</button>
      </div>
      <div className="laptop__base" />
      <div className="laptop__paper">
        <span>Billd</span>
        <b>Invoice</b>
        <small>INV-0043</small>
      </div>
      <div className="laptop__receipt">
        <span>PAYMENT RECEIVED</span>
        <strong>₦1,200,000</strong>
        <small>Paid via Paystack · 23 Jan</small>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="phone" aria-label="Billd invoice list on a phone">
      <div className="phone__notch" />
      <div className="phone__content">
        <div className="phone__top">
          <strong>Billd</strong>
          <span>☰</span>
        </div>
        <h3>Invoices</h3>
        <nav className="phone__tabs">
          <b>All</b>
          <span>Draft</span>
          <span>Sent</span>
          <span>Paid</span>
        </nav>
        {[
          ["Lagos Creative Studio", "₦1,200,000", "Paid"],
          ["Kanu Media", "₦450,000", "Sent"],
          ["Brightline Co.", "₦300,000", "Draft"],
        ].map(([client, amount, state]) => (
          <div className="phone__row" key={client}>
            <div>
              <b>{client}</b>
              <small>Invoice for project work</small>
            </div>
            <div>
              <strong>{amount}</strong>
              <em className={`status status--${state.toLowerCase()}`}>
                {state}
              </em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabletMockup() {
  return (
    <div className="tablet" aria-label="Billd payout account setup">
      <div className="tablet__camera" />
      <div className="tablet__content">
        <strong className="tablet__brand">Billd</strong>
        <h3>Set up payout account</h3>
        <p>Receive payments from clients through Paystack.</p>
        <label>
          Bank{" "}
          <span>
            GTBank <ChevronDown size={14} />
          </span>
        </label>
        <label>
          Account number <span>••••••••7421</span>
        </label>
        <label>
          Account holder{" "}
          <span className="verified">
            <Check size={12} /> Adeniyi Creative
          </span>
        </label>
      </div>
    </div>
  );
}

export function LandingExperience() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="landing-shell landing-header__inner">
          <BilldLogo href="/" size="md" theme="dark" />
          <nav>
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#independent-work">For freelancers</a>
          </nav>
          <div className="landing-header__actions">
            <Link href="/sign-in">Sign in</Link>
            <Link
              className="landing-button landing-button--small"
              href="/sign-up"
            >
              Create invoice
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-shell hero" id="product">
        <div className="hero__copy">
          <p className="eyebrow">INVOICING FOR INDEPENDENT WORK</p>
          <h1>Turn finished work into a clear next step.</h1>
          <p className="hero__lede">
            Create a professional invoice, share a way to pay, and keep every
            project from delivery to payment in one place.
          </p>
          <div className="hero__actions">
            <Link className="landing-button" href="/sign-up">
              Create your first invoice <ArrowRight size={16} />
            </Link>
            <a className="hero__quiet-link" href="#how-it-works">
              See the payment trail <ArrowRight size={15} />
            </a>
          </div>
          <p className="hero__footnote">
            One place for the invoice, the delivery record, and the payment.
          </p>
        </div>
        <LaptopMockup />
      </section>

      <div className="landing-shell proof-strip">
        <span>
          <ReceiptText size={18} /> Professional PDFs
        </span>
        <span>
          <Send size={18} /> Payment links
        </span>
        <span>
          <MailCheck size={18} /> Clear payment status
        </span>
      </div>

      <section className="landing-shell video-section" id="how-it-works">
        <div>
          <p className="eyebrow">THE PAYMENT TRAIL</p>
          <h2>The job ends. The paper trail shouldn&apos;t.</h2>
          <p>
            Billd keeps client details, issued invoices, delivery status, and
            payments together so you can return to any project with context.
          </p>
        </div>
        <div
          className="video-placeholder"
          aria-label="Product demonstration video placeholder"
        >
          <div className="video-placeholder__sequence">
            <span>Draft</span>
            <ArrowRight />
            <span>Sent</span>
            <ArrowRight />
            <span className="paid">Paid</span>
          </div>
          <CirclePlay size={58} strokeWidth={1.25} />
          <small>Replace with a 20–30 second Billd product demo</small>
        </div>
      </section>

      <section className="landing-shell audience-section" id="independent-work">
        <div>
          <p className="eyebrow">BUILT FOR INDEPENDENT WORK</p>
          <h2>Less admin around the work you already do.</h2>
        </div>
        <div className="audience-section__body">
          <p>
            Billd is for the developer wrapping up a sprint, the designer
            handing over a brand, the consultant closing an engagement, and the
            small studio keeping client work organised.
          </p>
          <ul>
            <li>
              <Check size={16} /> Freelance developers
            </li>
            <li>
              <Check size={16} /> Designers and consultants
            </li>
            <li>
              <Check size={16} /> Small creative and development studios
            </li>
          </ul>
        </div>
      </section>

      <section className="landing-shell status-section">
        <PhoneMockup />
        <div className="status-section__copy">
          <p className="eyebrow">AFTER YOU PRESS SEND</p>
          <h2>Know before you follow up.</h2>
          <p>
            Every invoice has a clear next state. Check whether it was
            delivered, paid, or needs your attention.
          </p>
          <div className="status-list">
            <span>
              <MailCheck size={18} /> Delivered to client
            </span>
            <span>
              <Check size={18} /> Payment received
            </span>
            <span>
              <Smartphone size={18} /> Overdue at a glance
            </span>
          </div>
        </div>
      </section>

      <section className="archive-section">
        <div className="landing-shell archive-section__inner">
          <div>
            <p className="eyebrow">A RECORD THAT HOLDS UP</p>
            <h2>The invoice should remember what was true when you sent it.</h2>
            <p>
              Billd preserves the business and client details associated with an
              issued invoice, so old work remains accurate when your information
              changes later.
            </p>
          </div>
          <div className="archive-paper">
            <span className="archive-paper__stamp">
              ISSUED
              <br />
              <small>20 JAN, 2025</small>
            </span>
            <InvoiceDocument compact />
          </div>
        </div>
      </section>

      <section className="landing-shell payout-section">
        <TabletMockup />
        <div>
          <p className="eyebrow">PAYMENT ROUTING</p>
          <h2>A payout account that belongs to your work.</h2>
          <p>
            Save your payout account once. When online payments are enabled,
            Billd can route invoice payments through Paystack to the
            freelancer&apos;s saved account.
          </p>
          <div className="payout-note">
            <ShieldCheck size={18} />
            <span>Designed for clear, traceable payment records.</span>
          </div>
        </div>
      </section>

      <section className="landing-shell faq-section">
        <div>
          <p className="eyebrow">PRACTICAL QUESTIONS</p>
          <h2>What clients and freelancers need to know.</h2>
        </div>
        <dl>
          <div>
            <dt>Can clients pay online?</dt>
            <dd>
              Yes. Billd can add a Paystack payment link when online payments
              are configured.
            </dd>
          </div>
          <div>
            <dt>Can I download an invoice as a PDF?</dt>
            <dd>Yes. Each invoice can be generated as a professional PDF.</dd>
          </div>
          <div>
            <dt>Can I tell whether an invoice was delivered?</dt>
            <dd>
              Yes. Billd records delivery status so you can follow up with
              context.
            </dd>
          </div>
          <div>
            <dt>What happens when a client pays?</dt>
            <dd>
              Payments are recorded against the invoice, making its status clear
              in your workspace.
            </dd>
          </div>
        </dl>
      </section>

      <section className="landing-shell final-cta">
        <p className="eyebrow">BILLD</p>
        <h2>Work delivered deserves a clear way to be paid.</h2>
        <p>Set up your first client and invoice in a few minutes.</p>
        <Link className="landing-button" href="/sign-up">
          Start creating invoices <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="landing-shell">
          <BilldLogo href="/" size="sm" theme="dark" />
          <p>Invoicing and payments for independent professionals.</p>
          <div>
            <a href="#product">Product</a>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
