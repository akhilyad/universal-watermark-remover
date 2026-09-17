import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Cpu, Terminal, ExternalLink } from "lucide-react";

interface HeaderProps {
  backendConnected: boolean;
  backendVersion?: string;
  onOpenCliModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  backendConnected,
  backendVersion,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-zinc-100 text-zinc-950 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100">
              WATERMARK<span className="text-zinc-500">//</span>REMOVER
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              Editorial v1.4
            </span>
          </div>
        </div>

        {/* Status indicator & links */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                backendConnected
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  : "bg-zinc-500"
              }`}
            />
            <span className="font-mono text-[11px] text-zinc-400">
              {backendConnected
                ? `Python Engine v${backendVersion || "1.0"}`
                : "Client Neural Engine"}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Badge variant="mono" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
              22 FORMATS
            </Badge>
            <Badge variant="mono" className="text-[10px] text-zinc-400">
              C2PA STRIPPER
            </Badge>
            <Badge variant="mono" className="text-[10px] text-zinc-400">
              SYNTHID DETECT
            </Badge>
          </div>

          <a
            href="https://github.com/guillaumemeyer/watermarks-remover"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors p-1"
            title="Guillaume Meyer watermarks-remover repository"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Backend Repo</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
};
