import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface RestTimerProps {
  defaultSeconds?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

const PRESETS = [30, 60, 90, 120, 180];

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // silently fail
  }
}

export default function RestTimer({
  defaultSeconds = 60,
  onComplete,
  autoStart = false,
}: RestTimerProps) {
  const [total, setTotal] = useState(defaultSeconds);
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const reset = useCallback(
    (newTotal?: number) => {
      const t = newTotal ?? total;
      setTotal(t);
      setRemaining(t);
      setRunning(false);
      completedRef.current = false;
    },
    [total],
  );

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (!completedRef.current) {
              completedRef.current = true;
              playBeep();
              onComplete?.();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  const progress = total > 0 ? (total - remaining) / total : 1;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - progress);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isComplete = remaining === 0;

  return (
    <div
      data-ocid="rest_timer.panel"
      className="flex flex-col items-center gap-4"
    >
      <div className="relative w-36 h-36">
        <svg
          aria-hidden="true"
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="oklch(0.22 0.04 240)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={isComplete ? "#32E36B" : "#3B82F6"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-bold tabular-nums ${isComplete ? "text-neon" : "text-foreground"}`}
            aria-live="polite"
            aria-label={`${remaining} seconds remaining`}
          >
            {timeStr}
          </span>
          <span className="text-xs text-muted-foreground">
            {isComplete ? "Done!" : "remaining"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {PRESETS.map((s) => (
          <button
            key={s}
            type="button"
            data-ocid="rest_timer.toggle"
            onClick={() => reset(s)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              total === s
                ? "bg-neon text-neon-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}s
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          data-ocid="rest_timer.button"
          variant="outline"
          size="sm"
          onClick={() => setRunning((r) => !r)}
          disabled={isComplete}
          className="flex items-center gap-1.5 min-w-[80px]"
        >
          {running ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          {running ? "Pause" : "Start"}
        </Button>
        <Button
          type="button"
          data-ocid="rest_timer.secondary_button"
          variant="outline"
          size="sm"
          onClick={() => reset()}
          className="flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
