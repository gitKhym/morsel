import { useRef } from "react";
import { Input } from "~/components/ui/input";

interface TimeInputProps {
  value?: number;
  onChange: (value: number) => void;
  className?: string;
  largeLabel?: string;
  smallLabel?: string;
}

function valueToParts(total: number) {
  const safe = Math.max(0, total ?? 0);
  return {
    large: Math.floor(safe / 60),
    small: safe % 60,
  };
}

function partsToValue(large: number, small: number) {
  const l = Math.max(0, large);
  const s = Math.min(59, Math.max(0, small));
  return l * 60 + s;
}

export default function TimeInput({
  value = 0,
  onChange,
  className,
  largeLabel = "h",
  smallLabel = "m",
}: TimeInputProps) {
  const { large, small } = valueToParts(value);

  const largeRef = useRef<HTMLInputElement | null>(null);
  const smallRef = useRef<HTMLInputElement | null>(null);

  function updateLarge(newLarge: number) {
    onChange(partsToValue(newLarge, small));
  }

  function updateSmall(newSmall: number) {
    onChange(partsToValue(large, newSmall));
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Input
          ref={largeRef}
          type="text"
          inputMode="numeric"
          value={large}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            updateLarge(val === "" ? 0 : Number(val));
          }}
          className="h-8 w-12 border px-1 text-center font-medium tabular-nums shadow-none"
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            if (e.target.value === "") updateLarge(0);
          }}
        />
        <span className="text-muted-foreground text-xs font-medium">{largeLabel}</span>
      </div>

      <div className="flex items-center gap-1">
        <Input
          ref={smallRef}
          type="text"
          inputMode="numeric"
          value={small.toString().padStart(2, "0")}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            const num = val === "" ? 0 : Number(val);
            if (num <= 59) {
              updateSmall(num);
            } else {
              // Capping or taking last two digits
              updateSmall(Number(val.slice(-2)) % 60);
            }
          }}
          className="h-8 w-12 border px-1 text-center font-medium tabular-nums shadow-none"
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            if (e.target.value === "") updateSmall(0);
          }}
        />
        <span className="text-muted-foreground text-xs font-medium">{smallLabel}</span>
      </div>
    </div>
  );
}
