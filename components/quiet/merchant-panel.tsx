"use client";

import { RoomCodeCard } from "@/components/payment/room-code-card";
import {
  TransportTabs,
  type TransportMode,
} from "@/components/payment/transport-tabs";
import { QuietProvider, useQuiet } from "@/components/quiet/quiet-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { SoundWave } from "@/components/ui/sound-wave";
import { useRelaySend } from "@/hooks/use-relay-payment";
import { useRoomSession } from "@/hooks/use-room-session";
import { getInsecureContextHint } from "@/lib/device-capabilities";
import { QUIET_PROFILE } from "@/lib/quiet/types";
import { buildPaymentPayload } from "@/lib/room-code";
import { AlertCircle, Send, Volume2, Wifi } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

export function MerchantPanelRoot() {
  const [mode, setMode] = useState<TransportMode>("wifi");
  return (
    <QuietProvider enabled={mode === "ultrasonic"} role="merchant">
      <MerchantPanel mode={mode} onModeChange={setMode} />
    </QuietProvider>
  );
}

function MerchantPanel({
  mode,
  onModeChange,
}: {
  mode: TransportMode;
  onModeChange: (m: TransportMode) => void;
}) {
  const { roomCode, setRoomCode, regenerateRoom, isValid, shareUrl } =
    useRoomSession("merchant");
  const [paymentId, setPaymentId] = useState("123");
  const [description, setDescription] = useState("Coffee 3 Cup");
  const [transmitting, setTransmitting] = useState(false);

  const { send, sending, error: relayError, lastSent } = useRelaySend(roomCode);
  const { status, error: quietError, whenReady } = useQuiet();

  const ultrasonicBlocked = Boolean(getInsecureContextHint());

  const transmitUltrasonic = useCallback(() => {
    if (!window.Quiet || status !== "ready") return;

    const payload = buildPaymentPayload(paymentId, description);
    if (!payload || payload === "-") return;

    setTransmitting(true);
    const tx = window.Quiet.transmitter({
      profile: QUIET_PROFILE,
      clampFrame: false,
      onFinish: () => setTransmitting(false),
    });
    tx.transmit(window.Quiet.str2ab(payload));
  }, [status, paymentId, description]);

  const handleSend = async () => {
    if (!isValid) return;

    if (mode === "wifi") {
      await send(paymentId, description);
      return;
    }

    whenReady(transmitUltrasonic);
  };

  const busy = sending || transmitting;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 md:py-14">
      <div className="text-center">
        <Badge variant="success">Merchant terminal</Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Send payment
        </h1>
        <p className="mt-3 text-slate-600">
          Share the session code, then confirm — works across devices on the same
          network.
        </p>
      </div>

      {mode === "wifi" && (
        <RoomCodeCard
          role="merchant"
          roomCode={roomCode}
          onRoomCodeChange={setRoomCode}
          onRegenerate={regenerateRoom}
          shareUrl={shareUrl}
        />
      )}

      <GlassCard>
        <TransportTabs
          mode={mode}
          onChange={onModeChange}
          ultrasonicDisabled={ultrasonicBlocked}
        />

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Transaction ID
            </label>
            <Input
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="max-w-[140px]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {mode === "ultrasonic" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Volume2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-900/80">
              Customer should use Sound wave mode, allow the microphone, and keep
              volume around 50%. Room link is more reliable on one device or LAN.
            </p>
          </div>
        )}

        <div className="my-8 flex justify-center">
          <SoundWave active={busy} />
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={
            busy ||
            (mode === "wifi" && !isValid) ||
            (mode === "ultrasonic" && status !== "ready")
          }
          onClick={handleSend}
        >
          {mode === "wifi" ? (
            <Wifi className="h-5 w-5" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {busy
            ? "Sending…"
            : mode === "wifi"
              ? "Send payment"
              : status !== "ready"
                ? "Preparing audio…"
                : "Transmit sound wave"}
        </Button>

        {(relayError || (mode === "ultrasonic" && quietError)) && (
          <p className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {relayError || quietError}
          </p>
        )}

        {lastSent && !busy && mode === "wifi" && (
          <p className="mt-4 text-center text-sm font-medium text-emerald-700">
            Sent to session {roomCode}
          </p>
        )}
      </GlassCard>

      <div className="flex justify-center">
        <Link href="/">
          <Button variant="ghost">← Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
