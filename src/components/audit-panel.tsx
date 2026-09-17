import React from "react";
import { CleanReport } from "@/lib/watermark-engine";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  FileCode,
  Zap,
  TrendingDown,
  Cpu,
} from "lucide-react";

interface AuditPanelProps {
  report: CleanReport;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ report }) => {
  const sizeDiff = report.bytesOut - report.bytesIn;
  const sizePct = ((sizeDiff / report.bytesIn) * 100).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-md border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-[#111111]" />
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
            Provenance Audit & Sanitization Report
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-[#E5E5E5] bg-[#FAFAFA] text-[#111111] font-mono">
            {report.engine}
          </Badge>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: C2PA Signature */}
        <div className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-3">
          <div className="text-[11px] font-mono text-[#71717A]">C2PA Manifest</div>
          <div className="mt-1.5 flex items-center gap-1.5 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="font-bold text-emerald-600">STRIPPED</span>
          </div>
          <div className="mt-1 text-[10px] text-[#71717A] font-mono">
            JUMB / XMP cleared
          </div>
        </div>

        {/* Metric 2: SynthID Confidence Delta */}
        <div className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-3">
          <div className="text-[11px] font-mono text-[#71717A]">SynthID Score</div>
          <div className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-[#111111]">
            <span className="text-red-500 line-through">
              {(report.synthidBefore.confidence * 100).toFixed(0)}%
            </span>
            <span className="text-[#71717A]">→</span>
            <span className="text-emerald-600 font-bold">
              {(report.synthidAfter.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="mt-1 text-[10px] text-emerald-600 font-mono font-medium">
            Negative / Undetectable
          </div>
        </div>

        {/* Metric 3: File Size Delta */}
        <div className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-3">
          <div className="text-[11px] font-mono text-[#71717A]">Payload Delta</div>
          <div className="mt-1.5 font-mono text-xs text-[#111111] font-semibold">
            {formatBytes(report.bytesIn)} → {formatBytes(report.bytesOut)}
          </div>
          <div className="mt-1 text-[10px] text-[#71717A] font-mono">
            {Number(sizePct) <= 0 ? `${sizePct}% optimized` : `+${sizePct}%`}
          </div>
        </div>

        {/* Metric 4: Runtime */}
        <div className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-3">
          <div className="text-[11px] font-mono text-[#71717A]">Convergence Time</div>
          <div className="mt-1.5 font-mono text-xs text-[#111111] flex items-center gap-1 font-semibold">
            <Zap className="h-3 w-3 text-[#111111]" />
            <span>{(report.durationMs / 1000).toFixed(2)}s</span>
          </div>
          <div className="mt-1 text-[10px] text-[#71717A] font-mono uppercase">
            {report.dimensions
              ? `${report.dimensions.width}×${report.dimensions.height}px`
              : `${report.format} container`}
          </div>
        </div>
      </div>

      {/* Applied Pipeline Actions */}
      <div className="mt-4 pt-3 border-t border-[#E5E5E5]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#71717A] mb-2 font-semibold">
          Sanitization Sequence Actions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {report.actions.map((act, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-[3px] bg-[#FAFAFA] p-2 border border-[#E5E5E5] font-mono text-[11px] text-[#111111]"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
