import type { PaymentRecord } from "@/lib/relay/store";
import { CheckCircle2 } from "lucide-react";

export function PaymentReceivedCard({
  payment,
  via,
}: {
  payment: PaymentRecord;
  via: "wifi" | "ultrasonic";
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50">
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <span className="font-semibold text-emerald-800">Payment received</span>
        <span className="ml-auto text-xs font-medium text-emerald-600">
          {via === "wifi" ? "Room link" : "Sound wave"}
        </span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            ID
          </p>
          <p className="mt-1 font-mono text-lg text-slate-900">{payment.id}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Details
          </p>
          <p className="mt-1 text-lg text-slate-900">{payment.message}</p>
        </div>
      </div>
      <div className="border-t border-emerald-100 px-4 py-3">
        <p className="truncate font-mono text-xs text-slate-500">
          {payment.payload}
        </p>
      </div>
    </div>
  );
}
