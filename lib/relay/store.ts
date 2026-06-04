export type PaymentRecord = {
  payload: string;
  id: string;
  message: string;
  sentAt: number;
};

type Subscriber = (record: PaymentRecord) => void;

class RelayStore {
  private rooms = new Map<string, PaymentRecord>();
  private subscribers = new Map<string, Set<Subscriber>>();

  publish(room: string, record: PaymentRecord) {
    this.rooms.set(room, record);
    const subs = this.subscribers.get(room);
    if (subs) {
      subs.forEach((fn) => fn(record));
    }
  }

  get(room: string): PaymentRecord | undefined {
    return this.rooms.get(room);
  }

  subscribe(room: string, fn: Subscriber): () => void {
    let set = this.subscribers.get(room);
    if (!set) {
      set = new Set();
      this.subscribers.set(room, set);
    }
    set.add(fn);
    return () => {
      set?.delete(fn);
      if (set?.size === 0) {
        this.subscribers.delete(room);
      }
    };
  }
}

const globalStore = globalThis as typeof globalThis & {
  __nearPayRelay?: RelayStore;
};

export function getRelayStore(): RelayStore {
  if (!globalStore.__nearPayRelay) {
    globalStore.__nearPayRelay = new RelayStore();
  }
  return globalStore.__nearPayRelay;
}
