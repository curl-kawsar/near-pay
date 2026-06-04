const ROOM_RE = /^\d{6}$/;

export function generateRoomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function normalizeRoomCode(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 6);
}

export function isValidRoomCode(code: string): boolean {
  return ROOM_RE.test(code);
}

export function buildPaymentPayload(id: string, message: string): string {
  return `${id.trim()}-${message.trim()}`;
}
