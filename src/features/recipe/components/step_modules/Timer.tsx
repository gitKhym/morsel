"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface TimerProps {
  time: number; // in seconds
  title: string | null;
}

export default function Timer({ time, title }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(time);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsRunning(false);
    }
  }, [timeRemaining]);

  useEffect(() => {
    setTimeRemaining(time);
  }, [time]);

  const hours = String(Math.floor(timeRemaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeRemaining % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(timeRemaining % 60).padStart(2, "0");

  const formattedTime =
    hours !== "00" ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;

  const startButtonLabel = (() => {
    if (isRunning) return "Pause";
    if (timeRemaining === 0) return "Restart";
    if (timeRemaining === time) return "Start";
    return "Resume";
  })();

  const startButtonIcon = (() => {
    if (isRunning) return <Pause className="fill-primary-foreground" />;
    if (timeRemaining === 0)
      return <RotateCcw className="fill-primary-foreground" />;
    if (timeRemaining === time)
      return <Play className="fill-primary-foreground" />;
    return <Play className="fill-primary-foreground" />;
  })();

  const handleStartClick = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(time);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(time);
  };

  return (
    <div className="bg-accent-secondary grid grid-rows-[auto_1fr_auto] rounded-sm p-3">
      <h1 className="flex items-center justify-center text-xs">{title}</h1>
      <span
        className={cn(
          "my-2 flex items-center justify-center text-3xl tracking-wide transition-all",
          !isRunning && "text-muted-foreground",
        )}
      >
        {formattedTime}
      </span>

      <section className="flex justify-center gap-2">
        <Button className="w-20 cursor-pointer" onClick={handleStartClick}>
          {startButtonLabel}
          {startButtonIcon}
        </Button>

        <Button
          onClick={handleReset}
          disabled={timeRemaining === time}
          variant="secondary"
          className="cursor-pointer"
        >
          Reset
        </Button>
      </section>
    </div>
  );
}
