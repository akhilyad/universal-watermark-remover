import React, { useState } from "react";
import LoadingState from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  XCircle,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";

interface ThinkingPanelProps {
  currentStage: number; // 1 to 4
  currentStageName: string;
  stages?: { id: number; label: string }[];
  isProcessing: boolean;
  isCompleted: boolean;
  durationMs?: number;
  onCancel?: () => void;
  variant?: "Drive" | "Dots" | "Orbit";
}

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({
  currentStage,
  currentStageName,
  stages = [
    { id: 1, label: "Analyzing image tensor & byte headers..." },
    { id: 2, label: "Detecting watermark contours, bounding boxes & text zones..." },
    { id: 3, label: "Synthesizing pixel field via Laplacian diffusion inpainting..." },
    { id: 4, label: "Finalizing blend, color balance & zero-width strips..." },
  ],
  isProcessing,
  isCompleted,
  durationMs,
  onCancel,
  variant = "Drive",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If completed, show the compact summary pill inspired by Claude.ai ("Thought for 3.8s")
  if (isCompleted && durationMs !== undefined) {
    const seconds = (durationMs / 1000).toFixed(1);
    return (
      <div className="w-full flex flex-col items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs text-[#111111] hover:border-[#111111] hover:bg-[#FAFAFA] transition-all cursor-pointer select-none shadow-xs"
          aria-expanded={isExpanded}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#111111]" />
          <span className="font-medium text-[#111111]">Thought for {seconds}s</span>
          <span className="text-[#D4D4D8]">•</span>
          <span className="font-mono text-[11px] text-[#71717A]">4 stages verified</span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-[#71717A] group-hover:text-[#111111]" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#71717A] group-hover:text-[#111111]" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 w-full max-w-xl rounded-md border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-sm transition-all text-[#111111]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]">
                <Layers className="h-3.5 w-3.5" />
                Pipeline Execution Telemetry
              </div>
              <span className="font-mono text-[11px] text-[#111111] font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> All stages converged
              </span>
            </div>
            <div className="mt-3 space-y-2 font-mono text-xs">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between text-[#111111] bg-[#FAFAFA] px-2.5 py-1.5 rounded border border-[#E5E5E5]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{stage.label}</span>
                  </div>
                  <span className="text-[#71717A] text-[11px] font-semibold">PASS</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Processing State
  return (
    <div className="w-full max-w-xl rounded-md border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-sm transition-all duration-200">
      {/* Header with reference Vector LoadingState component */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <LoadingState label="Synthesizing" variant={variant} />

        {onCancel && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onCancel}
            className="text-[#71717A] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>
        )}
      </div>

      {/* Sequential Pipeline Logs with pulsating indicators */}
      <div className="mt-4 space-y-2.5">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#71717A] flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>Sequential Pipeline Logs</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {stages.map((stage) => {
            const isDone = currentStage > stage.id;
            const isCurrent = currentStage === stage.id;
            const isPending = currentStage < stage.id;

            return (
              <div
                key={stage.id}
                className={`flex items-center justify-between rounded-md px-3 py-2 border transition-all duration-200 ${
                  isCurrent
                    ? "border-[#111111] bg-[#FAFAFA] text-[#111111] font-medium shadow-xs"
                    : isDone
                    ? "border-[#E5E5E5] bg-[#FFFFFF] text-[#555555]"
                    : "border-transparent bg-transparent text-[#A1A1AA]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  )}
                  {isCurrent && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#111111] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#111111]" />
                    </span>
                  )}
                  {isPending && (
                    <span className="h-2 w-2 rounded-full bg-[#E5E5E5] shrink-0" />
                  )}
                  <span className={isCurrent ? "font-semibold text-[#111111]" : ""}>
                    {stage.label}
                  </span>
                </div>

                <div className="text-[10px] font-mono">
                  {isDone && <span className="text-emerald-600 font-semibold">DONE</span>}
                  {isCurrent && (
                    <span className="text-[#111111] font-semibold animate-pulse">RUNNING</span>
                  )}
                  {isPending && <span className="text-[#A1A1AA]">QUEUED</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zero Layout Shift Progress Bar */}
      <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#111111] animate-pulse" />
          <span>Stream Locked • Cancellation Responsive</span>
        </div>
        <span className="font-semibold text-[#111111]">{Math.round((currentStage / stages.length) * 100)}%</span>
      </div>
    </div>
  );
};
