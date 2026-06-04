"use client";

import { PaymentReceivedCard } from "@/components/payment/payment-received-card";
import { RoomCodeCard } from "@/components/payment/room-code-card";
import {
  TransportTabs,
  type TransportMode,
} from "@/components/payment/transport-tabs";
import { QuietProvider, useQuiet } from "@/components/quiet/quiet-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SoundWave } from "@/components/ui/sound-wave";
import { useRelayReceive } from "@/hooks/use-relay-payment";
import { useRoomSession } from "@/hooks/use-room-session";
import { getInsecureContextHint } from "@/lib/device-capabilities";
import { QUIET_PROFILE, parsePaymentPayload } from "@/lib/quiet/types";
import type { PaymentRecord } from "@/lib/relay/store";
import { AlertCircle, Mic, Wifi } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function CustomerPanelRoot() {
  const [mode, setMode] = useState<TransportMode>("wifi");
  return (
    <QuietProvider enabled={mode === "ultrasonic"} role="customer">
      <CustomerPanel mode={mode} onModeChange={setMode} />
    </QuietProvider>
  );
}

function CustomerPanel({
  mode,
  onModeChange,
}: {
  mode: TransportMode;
  onModeChange: (m: TransportMode) => void;
}) {
  const searchParams = useSearchParams();
  const { roomCode, setRoomCode, isValid, shareUrl } =
    useRoomSession("customer");
  const [wifiActive, setWifiActive] = useState(false);

  useEffect(() => {
    if (searchParams.get("room") && isValid && mode === "wifi") {
      setWifiActive(true);
    }
  }, [searchParams, isValid, mode]);
  const [listening, setListening] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [sonicPayment, setSonicPayment] = useState<PaymentRecord | null>(null);

  const { payment: wifiPayment, connected, error: relayError } =
    useRelayReceive(roomCode, wifiActive && isValid && mode === "wifi");
  const { status, error: quietError, whenReady } = useQuiet();

  const ultrasonicBlocked = Boolean(getInsecureContextHint());
  const recvState = useRef({
    successes: 0,
    failures: 0,
    content: new ArrayBuffer(0),
  });

  const startUltrasonic = useCallback(() => {
    if (!window.Quiet) return;

    setListening(true);
    setWarning(null);
    setSonicPayment(null);
    recvState.current = {
      successes: 0,
      failures: 0,
      content: new ArrayBuffer(0),
    };

    window.Quiet.receiver({
      profile: QUIET_PROFILE,
      onReceive: (payload) => {
        recvState.current.content = window.Quiet!.mergeab(
          recvState.current.content,
          payload,
        );
        const raw = window.Quiet!.ab2str(recvState.current.content);
        const parsed = parsePaymentPayload(raw);
        setSonicPayment({
          payload: raw,
          id: parsed.id,
          message: parsed.message,
          sentAt: Date.now(),
        });
        recvState.current.successes++;
      },
      onCreateFail: () => {
        setWarning(
          "Could not start microphone. Allow mic access or use Room link mode.",
        );
        setListening(false);
      },
      onReceiveFail: (numFails) => {
        recvState.current.failures = numFails;
        const total =
          recvState.current.failures + recvState.current.successes;
        const ratio =
          total > 0 ? (recvState.current.failures / total) * 100 : 0;
        setWarning(
          `Packet loss — move closer to merchant. ${recvState.current.failures}/${total} (${ratio.toFixed(0)}%)`,
        );
      },
    });
  }, []);

  const handleConnect = () => {
    if (mode === "wifi") {
      setWifiActive(true);
      return;
    }
    whenReady(startUltrasonic);
  };

  const payment = mode === "wifi" ? wifiPayment : sonicPayment;
  const waiting =
    mode === "wifi" ? wifiActive && !payment : listening && !payment;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 md:py-14">
      <div className="text-center">
        <Badge variant={waiting ? "active" : connected ? "success" : "default"}>
          {mode === "wifi"
            ? wifiActive
              ? connected
                ? `Connected · session ${roomCode}`
                : "Connecting…"
              : "Enter session code"
            : listening
              ? "Listening for sound…"
              : "Sound wave receive"}
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Receive payment
        </h1>
        <p className="mt-3 text-slate-600">
          Use the same session code as the merchant — instant over room link.
        </p>
      </div>

      <RoomCodeCard
        role="customer"
        roomCode={roomCode}
        onRoomCodeChange={setRoomCode}
        shareUrl={shareUrl}
      />

      <GlassCard>
        <TransportTabs
          mode={mode}
          onChange={(m) => {
            onModeChange(m);
            setWifiActive(false);
            setListening(false);
            setWarning(null);
          }}
          ultrasonicDisabled={ultrasonicBlocked}
        />

        <div className="mt-6 flex flex-col items-center py-4">
          <div
            className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all ${
              waiting
                ? "border-teal-300 bg-teal-50 shadow-lg shadow-teal-200/50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {mode === "wifi" ? (
              <Wifi
                className={`h-10 w-10 ${waiting ? "text-sky-600" : "text-slate-400"}`}
              />
            ) : (
              <Mic
                className={`h-10 w-10 ${waiting ? "text-teal-600" : "text-slate-400"}`}
              />
            )}
          </div>
          <SoundWave active={waiting} className="mb-6" />
          <Button
            size="lg"
            className="min-w-[240px]"
            disabled={
              !isValid ||
              (mode === "wifi" ? wifiActive : listening) ||
              (mode === "ultrasonic" && status === "error")
            }
            onClick={handleConnect}
          >
            {mode === "wifi"
              ? wifiActive
                ? "Waiting for merchant…"
                : "Join session"
              : listening
                ? "Listening…"
                : "Listen for sound"}
          </Button>
        </div>

        {(warning || relayError || (mode === "ultrasonic" && quietError)) && (
          <p className="flex items-center gap-2 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {warning || relayError || quietError}
          </p>
        )}

        {payment && (
          <div className="mt-6">
            <PaymentReceivedCard
              payment={payment}
              via={mode === "wifi" ? "wifi" : "ultrasonic"}
            />
          </div>
        )}

        {waiting && !payment && (
          <p className="mt-4 text-center text-sm text-slate-500">
            {mode === "wifi"
              ? "Waiting for the merchant to send payment…"
              : "Hold your device near the merchant speaker…"}
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
