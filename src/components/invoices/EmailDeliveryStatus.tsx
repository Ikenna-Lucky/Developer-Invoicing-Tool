"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Delivery = {
  id: string;
  status: "pending" | "processing" | "accepted" | "failed" | "cancelled";
  acceptedAt: string | null;
};
const messages: Record<Delivery["status"], string> = {
  pending: "Invoice email is queued for sending.",
  processing: "Invoice email is being sent.",
  accepted: "Resend accepted the email. This does not confirm inbox delivery.",
  failed:
    "The email could not be confirmed as sent. Check the recipient and sender configuration before resending.",
  cancelled: "This email request was cancelled.",
};

export function EmailDeliveryStatus({
  invoiceId,
  refreshKey,
}: {
  invoiceId: string;
  refreshKey: string;
}) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function load() {
      try {
        const result = await apiRequest<{ data: Delivery[] }>(
          `/invoices/${invoiceId}/email-deliveries`,
        );
        if (cancelled) return;
        setDelivery(result.data[0] ?? null);
        setError("");
        if (
          result.data[0] &&
          ["pending", "processing"].includes(result.data[0].status)
        )
          timer = setTimeout(load, 5000);
      } catch {
        if (!cancelled)
          setError(
            "Email status is temporarily unavailable. Reload this page to check again.",
          );
      }
    }
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [invoiceId, refreshKey]);
  return (
    <p className="mt-4 text-sm text-white/60" role="status">
      {error ||
        (delivery
          ? messages[delivery.status]
          : "No email delivery has been recorded for this invoice.")}
    </p>
  );
}
