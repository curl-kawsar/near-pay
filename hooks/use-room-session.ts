"use client";

import { generateRoomCode, isValidRoomCode, normalizeRoomCode } from "@/lib/room-code";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useRoomSession(role: "merchant" | "customer") {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromUrl = searchParams.get("room") ?? "";

  const [roomCode, setRoomCode] = useState(() => {
    const normalized = normalizeRoomCode(fromUrl);
    if (isValidRoomCode(normalized)) return normalized;
    return role === "merchant" ? generateRoomCode() : "";
  });

  useEffect(() => {
    const normalized = normalizeRoomCode(fromUrl);
    if (isValidRoomCode(normalized)) {
      setRoomCode(normalized);
    }
  }, [fromUrl]);

  const syncRoomToUrl = useCallback(
    (code: string) => {
      const path = role === "merchant" ? "/merchant" : "/customer";
      const params = new URLSearchParams();
      if (isValidRoomCode(code)) params.set("room", code);
      const q = params.toString();
      router.replace(q ? `${path}?${q}` : path, { scroll: false });
    },
    [role, router],
  );

  const updateRoomCode = useCallback(
    (value: string) => {
      const next = normalizeRoomCode(value);
      setRoomCode(next);
      if (isValidRoomCode(next)) syncRoomToUrl(next);
    },
    [syncRoomToUrl],
  );

  const regenerateRoom = useCallback(() => {
    const next = generateRoomCode();
    setRoomCode(next);
    syncRoomToUrl(next);
  }, [syncRoomToUrl]);

  const shareUrl =
    typeof window !== "undefined" && isValidRoomCode(roomCode)
      ? `${window.location.origin}/customer?room=${roomCode}`
      : "";

  return {
    roomCode,
    setRoomCode: updateRoomCode,
    regenerateRoom,
    isValid: isValidRoomCode(roomCode),
    shareUrl,
  };
}
