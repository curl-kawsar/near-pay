"use client";

import { cn } from "@/lib/utils";
import { Wifi, Waves } from "lucide-react";

export type TransportMode = "wifi" | "ultrasonic";

export function TransportTabs({
  mode,
  onChange,
  ultrasonicDisabled,
}: {
  mode: TransportMode;
  onChange: (m: TransportMode) => void;
  ultrasonicDisabled?: boolean;
}) {
  const tabs: {
    id: TransportMode;
    label: string;
    hint: string;
    icon: typeof Wifi;
  }[] = [
    {
      id: "wifi",
      label: "Room link",
      hint: "Same network — fast and reliable",
      icon: Wifi,
    },
    {
      id: "ultrasonic",
      label: "Sound wave",
      hint: "Invisible audio between devices",
      icon: Waves,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tabs.map((tab) => {
        const disabled = tab.id === "ultrasonic" && ultrasonicDisabled;
        const Icon = tab.icon;
        const selected = mode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-xl border p-4 text-left transition",
              selected
                ? "border-teal-300 bg-teal-50/80 ring-1 ring-teal-200"
                : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white",
              disabled && "cursor-not-allowed opacity-45",
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "h-5 w-5",
                  selected ? "text-teal-600" : "text-slate-400",
                )}
              />
              <span className="font-semibold text-slate-900">{tab.label}</span>
              {tab.id === "wifi" && (
                <span className="ml-auto rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                  Recommended
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{tab.hint}</p>
          </button>
        );
      })}
      {ultrasonicDisabled && (
        <p className="col-span-full text-xs text-amber-700">
          Sound wave needs a secure connection on this device. Use Room link, or
          run the app with HTTPS for mobile.
        </p>
      )}
    </div>
  );
}
