import { CustomerPanelRoot } from "@/components/quiet/customer-panel";
import { Suspense } from "react";

export default function CustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
          Loading customer…
        </div>
      }
    >
      <CustomerPanelRoot />
    </Suspense>
  );
}
