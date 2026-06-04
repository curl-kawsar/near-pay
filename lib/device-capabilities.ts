export function isSecureContext(): boolean {
  if (typeof window === "undefined") return true;
  return window.isSecureContext;
}

export function getInsecureContextHint(): string | null {
  if (typeof window === "undefined") return null;
  if (window.isSecureContext) return null;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return null;
  return `Microphone access requires HTTPS on ${host}. Use "WiFi Room" mode, or run: bun run dev:https`;
}

export function getLanDevUrl(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.origin;
}
