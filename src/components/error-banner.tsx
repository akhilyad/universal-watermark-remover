import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, X } from "lucide-react";

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-md border border-red-200 bg-red-50/50 p-4 shadow-xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-[3px] bg-red-100 p-1.5 text-red-600 border border-red-200">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-xs font-semibold text-red-700 uppercase tracking-wide">
              Pipeline Convergence Error
            </div>
            <p className="mt-1 font-mono text-xs text-[#111111]">
              {error}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-[#71717A] hover:text-[#111111] p-1 cursor-pointer"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-red-200/60 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-[#71717A] hover:text-[#111111]"
        >
          Dismiss
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-1.5 cursor-pointer font-mono"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Operation</span>
        </Button>
      </div>
    </div>
  );
};
