import { ChevronDown, ChevronUp } from "lucide-react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface TimeInputProps {
  value?: number;
  onChange: (value: number) => void;
  className?: string;
}
function secondsToParts(total: number) {
  const safe = Math.max(0, total ?? 0);

  return {
    minutes: Math.floor(safe / 60),
    seconds: safe % 60,
  };
}

function partsToSeconds(minutes: number, seconds: number) {
  const m = Math.max(0, minutes);
  const s = Math.min(59, Math.max(0, seconds));
  return m * 60 + s;
}

export default function TimeInput({
  value = 0,
  onChange,
  className,
}: TimeInputProps) {
  const { minutes, seconds } = secondsToParts(value);

  const minutesRef = useRef<HTMLInputElement | null>(null);
  const secondsRef = useRef<HTMLInputElement | null>(null);

  function updateMinutes(newMinutes: number) {
    onChange(partsToSeconds(newMinutes, seconds));
  }

  function updateSeconds(newSeconds: number) {
    onChange(partsToSeconds(minutes, newSeconds));
  }

  function incrementMinutes() {
    updateMinutes(minutes + 1);
  }

  function decrementMinutes() {
    updateMinutes(Math.max(0, minutes - 1));
  }

  function incrementSeconds() {
    if (seconds === 59) {
      updateMinutes(minutes + 1);
      updateSeconds(0);
    } else {
      updateSeconds(seconds + 1);
    }
  }

  function decrementSeconds() {
    if (seconds === 0 && minutes > 0) {
      updateMinutes(minutes - 1);
      updateSeconds(59);
    } else {
      updateSeconds(Math.max(0, seconds - 1));
    }
  }

  return (
    <div
      className={`flex items-center justify-center space-x-1 rounded-md ${className}`}
    >
      {/* Minutes */}
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={incrementMinutes}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>

        <Input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          value={minutes}
          onChange={(e) =>
            updateMinutes(Number(e.target.value.replace(/\D/g, "")))
          }
          className="w-10 border-0 p-0 text-center focus:ring-0 focus:outline-none"
          onFocus={(e) => e.target.select()}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={decrementMinutes}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <span className="text-sm font-medium">:</span>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={incrementSeconds}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>

        <Input
          ref={secondsRef}
          type="text"
          inputMode="numeric"
          value={seconds.toString().padStart(2, "0")}
          onChange={(e) =>
            updateSeconds(Number(e.target.value.replace(/\D/g, "").slice(0, 2)))
          }
          className="w-10 border-0 p-0 text-center focus:ring-0 focus:outline-none"
          onFocus={(e) => e.target.select()}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={decrementSeconds}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
