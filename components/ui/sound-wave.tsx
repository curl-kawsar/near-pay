import { cn } from "@/lib/utils";

const BAR_HEIGHTS = [28, 48, 36, 64, 40, 56, 32, 52, 44, 60, 38, 50];

export function SoundWave({
  active = false,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex h-16 items-end justify-center gap-1", className)}>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 rounded-full bg-gradient-to-t from-teal-600 to-teal-300",
            !active && "opacity-40",
          )}
          style={{ height: active ? `${h}%` : "20%" }}
        />
      ))}
    </div>
  );
}
