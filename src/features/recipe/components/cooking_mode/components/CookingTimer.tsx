"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface CookingTimerProps {
  initialTime: number; // in seconds
  title: string | null;
}

export function CookingTimer({ initialTime, title }: CookingTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isMaximized, setIsMaximized] = useState(false);

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
    setTimeRemaining(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  const formatTime = (secondsTotal: number) => {
    const hours = String(Math.floor(secondsTotal / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((secondsTotal % 3600) / 60)).padStart(2, "0");
    const seconds = String(secondsTotal % 60).padStart(2, "0");
    return hours !== "00" ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  };

  const handleStartClick = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(initialTime);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
  };

  const startButtonIcon = isRunning ? (
    <Pause className="h-4 w-4 fill-current" />
  ) : timeRemaining === 0 ? (
    <RotateCcw className="h-4 w-4" />
  ) : (
    <Play className="h-4 w-4 fill-current" />
  );

  return (
    <>
      {/* Compact View */}
      <div className="flex items-center gap-3 bg-accent-secondary rounded-md px-4 h-12 select-none border border-border">
        <span className={cn(
          "font-mono text-xl tracking-tighter tabular-nums font-bold",
          !isRunning && timeRemaining > 0 && "text-muted-foreground"
        )}>
          {formatTime(timeRemaining)}
        </span>
        
        <div className="flex items-center gap-2 border-l pl-3 ml-1.5">
          <Button 
            size="sm" 
            variant="default"
            onClick={handleStartClick}
            className="h-8 px-3 gap-1.5 bg-primary text-primary-foreground font-medium"
          >
            {startButtonIcon}
            <span>{isRunning ? "Pause" : "Start"}</span>
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMaximized(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Maximized View via Nested Dialog */}
      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent 
          className="max-w-3xl border-2 bg-card p-12 shadow-2xl rounded-3xl sm:max-w-3xl gap-12 flex flex-col items-center"
          showCloseButton={false}
        >
          <VisuallyHidden.Root>
            <DialogTitle>{title || "Timer"}</DialogTitle>
          </VisuallyHidden.Root>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMaximized(false)}
            className="absolute top-6 right-6 h-12 w-12 text-muted-foreground hover:text-foreground"
          >
            <X className="h-8 w-8" />
          </Button>

          <div className="flex flex-col items-center gap-12 w-full">
            <span className={cn(
              "text-9xl font-black tracking-tighter tabular-nums transition-all duration-300",
              isRunning ? "text-primary" : "text-foreground"
            )}>
              {formatTime(timeRemaining)}
            </span>
            
            <div className="flex items-center gap-6">
              <Button 
                size="lg"
                onClick={handleStartClick}
                className="h-20 px-12 text-2xl gap-4 rounded-2xl shadow-lg shadow-primary/20"
              >
                {isRunning ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
                {isRunning ? "Pause" : "Start"}
              </Button>
              
              <Button
                size="lg"
                variant="secondary"
                onClick={handleReset}
                disabled={timeRemaining === initialTime}
                className="h-20 px-12 text-2xl gap-4 rounded-2xl border-2"
              >
                <RotateCcw className="h-8 w-8" />
                Reset
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsMaximized(false)}
                className="h-20 px-8 rounded-2xl border-2"
              >
                <Minimize2 className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
