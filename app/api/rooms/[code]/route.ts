import { getRelayStore } from "@/lib/relay/store";
import { buildPaymentPayload, isValidRoomCode } from "@/lib/room-code";
import { parsePaymentPayload } from "@/lib/quiet/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ code: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { code } = await context.params;
  const room = code.trim();

  if (!isValidRoomCode(room)) {
    return NextResponse.json({ error: "Invalid room code" }, { status: 400 });
  }

  let body: { id?: string; message?: string; payload?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload =
    body.payload ??
    buildPaymentPayload(body.id ?? "", body.message ?? "");

  if (!payload || payload === "-") {
    return NextResponse.json({ error: "Empty payment" }, { status: 400 });
  }

  const parsed = parsePaymentPayload(payload);
  const record = {
    payload,
    id: parsed.id,
    message: parsed.message,
    sentAt: Date.now(),
  };

  getRelayStore().publish(room, record);
  return NextResponse.json({ ok: true, ...record });
}

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const room = code.trim();

  if (!isValidRoomCode(room)) {
    return NextResponse.json({ error: "Invalid room code" }, { status: 400 });
  }

  const record = getRelayStore().get(room);
  if (!record) {
    return NextResponse.json({ payment: null });
  }

  return NextResponse.json({ payment: record });
}
