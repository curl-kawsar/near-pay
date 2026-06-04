"use client";

import { getInsecureContextHint } from "@/lib/device-capabilities";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type QuietStatus = "idle" | "loading" | "ready" | "error";

type QuietRole = "merchant" | "customer";

type QuietContextValue = {
  status: QuietStatus;
  error: string | null;
  whenReady: (fn: () => void) => void;
};

const QuietContext = createContext<QuietContextValue | null>(null);

function loadScript(src: string, async = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = async;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export function QuietProvider({
  children,
  enabled,
  role,
}: {
  children: ReactNode;
  enabled: boolean;
  role: QuietRole;
}) {
  const [status, setStatus] = useState<QuietStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const readyQueue = useRef<(() => void)[]>([]);
  const isReady = useRef(false);

  const flushReady = useCallback(() => {
    if (isReady.current) return;
    isReady.current = true;
    setStatus("ready");
    const queue = [...readyQueue.current];
    readyQueue.current = [];
    queue.forEach((fn) => fn());
  }, []);

  const whenReady = useCallback((fn: () => void) => {
    if (isReady.current) {
      fn();
      return;
    }
    readyQueue.current.push(fn);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      setError(null);
      isReady.current = false;
      readyQueue.current = [];
      return;
    }

    const insecure = getInsecureContextHint();
    if (insecure) {
      setStatus("error");
      setError(insecure);
      return;
    }

    let cancelled = false;
    isReady.current = false;
    readyQueue.current = [];
    setStatus("loading");
    setError(null);

    async function boot() {
      try {
        await loadScript("/quiet/quiet.js");
        if (cancelled) return;

        const initOpts =
          role === "customer"
            ? {
                profilesPrefix: "/quiet/",
                memoryInitializerPrefix: "/quiet/",
                libfecPrefix: "/quiet/",
              }
            : {
                profilesPrefix: "/quiet/",
                memoryInitializerPrefix: "/quiet/",
              };

        window.Quiet?.init(initOpts);
        await loadScript("/quiet/quiet-emscripten.js", true);
        if (cancelled) return;

        window.Quiet?.addReadyCallback(
          () => {
            if (!cancelled) flushReady();
          },
          (reason) => {
            if (!cancelled) {
              setStatus("error");
              setError(reason);
            }
          },
        );
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [enabled, role, flushReady]);

  const value = useMemo(
    () => ({ status: enabled ? status : "idle", error, whenReady }),
    [enabled, status, error, whenReady],
  );

  return (
    <QuietContext.Provider value={value}>{children}</QuietContext.Provider>
  );
}

export function useQuiet() {
  const ctx = useContext(QuietContext);
  if (!ctx) {
    throw new Error("useQuiet must be used within QuietProvider");
  }
  return ctx;
}
