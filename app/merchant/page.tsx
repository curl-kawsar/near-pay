import { MerchantPanelRoot } from "@/components/quiet/merchant-panel";
import { Suspense } from "react";

export default function MerchantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
          Loading merchant…
        </div>
      }
    >
      <MerchantPanelRoot />
    </Suspense>
  );
}
