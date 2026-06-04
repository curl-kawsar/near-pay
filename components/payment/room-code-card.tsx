"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidRoomCode } from "@/lib/room-code";
import { cn } from "@/lib/utils";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

export function RoomCodeCard({
  roomCode,
  onRoomCodeChange,
  onRegenerate,
  shareUrl,
  role,
}: {
  roomCode: string;
  onRoomCodeChange: (v: string) => void;
  onRegenerate?: () => void;
  shareUrl: string;
  role: "merchant" | "customer";
}) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const valid = isValidRoomCode(roomCode);

  async function copy(text: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-sky-900">Session code</p>
          <p className="text-xs text-slate-500">
            {role === "merchant"
              ? "Share this code with your customer."
              : "Enter the code shown on the merchant screen."}
          </p>
        </div>
        {role === "merchant" && onRegenerate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            title="New session code"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={roomCode}
          onChange={(e) => onRoomCodeChange(e.target.value)}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className={cn(
            "max-w-[160px] text-center font-mono text-2xl tracking-[0.3em]",
            valid && "border-sky-300",
          )}
          readOnly={role === "merchant"}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!valid}
          onClick={() => copy(roomCode, "code")}
        >
          {copied === "code" ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Copy code
        </Button>
        {role === "merchant" && shareUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy(shareUrl, "link")}
          >
            {copied === "link" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copy link
          </Button>
        )}
      </div>
    </div>
  );
}
