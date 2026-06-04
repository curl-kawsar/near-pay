"use client";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      <div className="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-teal-100/60 blur-3xl" />
      <div className="absolute -right-24 top-1/4 h-[400px] w-[400px] rounded-full bg-sky-100/50 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-teal-50/80 blur-3xl" />
    </div>
  );
}
