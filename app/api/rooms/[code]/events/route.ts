import { getRelayStore } from "@/lib/relay/store";
import { isValidRoomCode } from "@/lib/room-code";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ code: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { code } = await context.params;
  const room = code.trim();

  if (!isValidRoomCode(room)) {
    return new Response("Invalid room code", { status: 400 });
  }

  const store = getRelayStore();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: "connected", room });

      const existing = store.get(room);
      if (existing) {
        send({ type: "payment", payment: existing });
      }

      const unsubscribe = store.subscribe(room, (payment) => {
        send({ type: "payment", payment });
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
