"use client";

import type { PaymentRecord } from "@/lib/relay/store";
import { isValidRoomCode } from "@/lib/room-code";
import { useCallback, useEffect, useRef, useState } from "react";

export function useRelaySend(roomCode: string) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSent, setLastSent] = useState<PaymentRecord | null>(null);

  const send = useCallback(
    async (id: string, message: string) => {
      if (!isValidRoomCode(roomCode)) {
        setError("Enter a valid 6-digit room code.");
        return false;
      }

      setSending(true);
      setError(null);

      try {
        const res = await fetch(`/api/rooms/${roomCode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, message }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Send failed (${res.status})`);
        }

        const data = (await res.json()) as PaymentRecord;
        setLastSent(data);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Send failed");
        return false;
      } finally {
        setSending(false);
      }
    },
    [roomCode],
  );

  return { send, sending, error, lastSent };
}

export function useRelayReceive(roomCode: string, active: boolean) {
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!active || !isValidRoomCode(roomCode)) {
      sourceRef.current?.close();
      sourceRef.current = null;
      setConnected(false);
      return;
    }

    setError(null);
    setPayment(null);

    const es = new EventSource(`/api/rooms/${roomCode}/events`);
    sourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => {
      setConnected(false);
      setError("Lost connection to room. Check Wi‑Fi and retry.");
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          type?: string;
          payment?: PaymentRecord;
        };
        if (data.type === "payment" && data.payment) {
          setPayment(data.payment);
        }
      } catch {
        /* ignore malformed */
      }
    };

    return () => {
      es.close();
      sourceRef.current = null;
      setConnected(false);
    };
  }, [active, roomCode]);

  return { payment, connected, error };
}
