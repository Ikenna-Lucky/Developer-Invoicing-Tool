import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    // Landing page and any page without its own title use the default
    default: "Billd — Invoice clients. Get paid faster.",
    // Pages that export their own `title` string get: "Dashboard | Billd"
    template: "%s | Billd",
  },
  description:
    "Billd helps freelancers create polished invoices, email them to clients, and collect payments — automatically.",
  keywords: [
    "invoicing",
    "freelance",
    "payments",
    "billing",
    "invoice generator",
  ],
  authors: [{ name: "Billd" }],
  creator: "Billd",
  metadataBase: new URL("https://billid.netlify.app"),
  openGraph: {
    title: "Billd — Invoice clients. Get paid faster.",
    description:
      "Stop chasing payments. Billd turns your work into a polished invoice, emails it to your client, and collects payments — automatically.",
    url: "https://billid.netlify.app",
    siteName: "Billd",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Billd — Invoice clients. Get paid faster.",
    description:
      "Stop chasing payments. Create polished invoices and get paid faster with Billd.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
