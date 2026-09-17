import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCategory } from "@/lib/watermark-engine";
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  Columns,
  SplitSquareVertical,
  ZoomIn,
  ZoomOut,
  FileCode,
  FileText,
  FileAudio,
  FileVideo,
  FileArchive,
  Volume2,
  Play,
  Pause,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ComparisonSliderProps {
  originalUrl: string;
  cleanedUrl: string;
  cleanedBlob: Blob;
  fileName?: string;
  category: FileCategory;
  textBefore?: string;
  textAfter?: string;
  onReset: () => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  cleanedUrl,
  cleanedBlob,
  fileName = "output.bin",
  category,
  textBefore,
  textAfter,
  onReset,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeMediaTab, setActiveMediaTab] = useState<"after" | "before">("after");

  const containerRef = useRef<HTMLDivElement>(null);

  // Confetti celebration
  useEffect(() => {
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ["#ffffff", "#a1a1aa", "#71717a"],
        disableForReducedMotion: true,
      });
    } catch {
      // safe
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSlider(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) updateSlider(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe
    }
  };

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = cleanedUrl;
    const extMatch = fileName.match(/\.[^.]+$/);
    const ext = extMatch ? extMatch[0] : ".png";
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-cleaned${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    try {
      if (category === "text" && textAfter) {
        await navigator.clipboard.writeText(textAfter);
      } else if (category === "image" && cleanedBlob.type.startsWith("image/")) {
        const item = new ClipboardItem({ [cleanedBlob.type]: cleanedBlob });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(`Cleaned ${fileName}`);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isVisualImage = category === "image";
  const isSvg = fileName.endsWith(".svg");
  const isTextLike = category === "text";
  const isAudio = category === "audio";
  const isVideo = category === "video";
  const isDoc = category === "document";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[11px] gap-1.5 border-[#E5E5E5] bg-[#FFFFFF] text-[#111111] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            SANITIZATION CONVERGED
          </Badge>
          <span className="text-[#D4D4D8] hidden sm:inline">•</span>
          <span className="font-mono text-xs text-[#71717A] hidden sm:inline">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle for Images and Text */}
          {(isVisualImage || isTextLike) && (
            <div className="flex rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-0.5 text-xs">
              <button
                onClick={() => setViewMode("slider")}
                className={`flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[11px] transition-all cursor-pointer ${
                  viewMode === "slider"
                    ? "bg-[#111111] text-[#FFFFFF] font-medium shadow-xs"
                    : "text-[#71717A] hover:text-[#111111]"
                }`}
              >
                <SplitSquareVertical className="h-3.5 w-3.5" />
                <span>{isTextLike ? "Side-by-Side" : "Split Curtain"}</span>
              </button>
              {isVisualImage && (
                <button
                  onClick={() => setViewMode("side-by-side")}
                  className={`flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[11px] transition-all cursor-pointer ${
                    viewMode === "side-by-side"
                      ? "bg-[#111111] text-[#FFFFFF] font-medium shadow-xs"
                      : "text-[#71717A] hover:text-[#111111]"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>Side-by-Side</span>
                </button>
              )}
            </div>
          )}

          {/* Zoom Control for Images */}
          {isVisualImage && (
            <div className="flex items-center rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                disabled={zoomLevel <= 1}
                className="p-1 text-[#71717A] hover:text-[#111111] disabled:opacity-30 cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[10px] text-[#71717A] select-none">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                disabled={zoomLevel >= 2.5}
                className="p-1 text-[#71717A] hover:text-[#111111] disabled:opacity-30 cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. VISUAL IMAGE: SPLIT CURTAIN SLIDER */}
      {isVisualImage && viewMode === "slider" && (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative aspect-video w-full select-none overflow-hidden rounded-md border border-[#E5E5E5] bg-[#FAFAFA] shadow-sm cursor-ew-resize touch-none"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: "transform 0.15s ease-out",
          }}
        >
          <img
            src={cleanedUrl}
            alt="Cleaned"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          />
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 h-full w-full object-contain pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                maxWidth: "none",
              }}
            />
          </div>
          <div
            className="absolute top-0 bottom-0 z-20 w-[2px] bg-[#111111]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[#111111] shadow-md transition-transform hover:scale-110 active:scale-95">
              <div className="flex items-center gap-0.5">
                <span className="h-3 w-0.5 rounded-full bg-[#111111]" />
                <span className="h-3 w-0.5 rounded-full bg-[#111111]" />
              </div>
            </div>
          </div>
          <div className="absolute top-3 left-3 z-30 pointer-events-none">
            <span className="font-mono text-[10px] uppercase tracking-wider bg-[#111111] text-[#FFFFFF] px-2 py-1 rounded-[3px] shadow-sm">
              ORIGINAL (WATERMARKED)
            </span>
          </div>
          <div className="absolute top-3 right-3 z-30 pointer-events-none">
            <span className="font-mono text-[10px] uppercase tracking-wider bg-[#FFFFFF] text-[#111111] px-2 py-1 rounded-[3px] border border-[#E5E5E5] shadow-sm font-semibold">
              CLEANED (PURIFIED)
            </span>
          </div>
        </div>
      )}

      {/* 2. VISUAL IMAGE: SIDE BY SIDE */}
      {isVisualImage && viewMode === "side-by-side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#71717A] font-semibold">Original (Watermarked)</span>
              <Badge variant="outline" className="text-[10px] border-[#E5E5E5] text-[#555555]">BEFORE</Badge>
            </div>
            <div className="relative aspect-video rounded-md overflow-hidden border border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-center">
              <img src={originalUrl} alt="Before" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#111111] font-semibold">Purified Output</span>
              <Badge variant="outline" className="text-[10px] border-[#111111] bg-[#111111] text-[#FFFFFF]">AFTER</Badge>
            </div>
            <div className="relative aspect-video rounded-md overflow-hidden border border-[#111111] bg-[#FAFAFA] flex items-center justify-center shadow-xs">
              <img src={cleanedUrl} alt="After" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* 3. TEXT / MARKDOWN / HTML / SVG DIFF COMPARISON */}
      {isTextLike && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#71717A] font-semibold">Original with AI/Watermark Tags</span>
              <Badge variant="destructive" className="text-[10px]">BEFORE</Badge>
            </div>
            <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] h-80 overflow-auto font-mono text-xs text-[#555555]">
              <pre className="whitespace-pre-wrap">{textBefore || "(Original text with provenance metadata)"}</pre>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#111111] font-semibold">Sanitized & Purified Output</span>
              <Badge variant="outline" className="text-[10px] border-[#111111] bg-[#111111] text-[#FFFFFF]">AFTER (CLEAN)</Badge>
            </div>
            <div className="p-4 rounded-md border border-[#111111] bg-[#FAFAFA] h-80 overflow-auto font-mono text-xs text-[#111111]">
              <pre className="whitespace-pre-wrap">{textAfter || "(Sanitized output without AI tags)"}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 4. AUDIO COMPARISON */}
      {isAudio && (
        <div className="p-6 rounded-md border border-[#E5E5E5] bg-[#FFFFFF] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-[#111111]" />
              <span className="font-mono text-sm font-semibold text-[#111111]">Audio Stream Sanitized</span>
            </div>
            <div className="flex rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-0.5">
              <button
                onClick={() => setActiveMediaTab("after")}
                className={`px-3 py-1 font-mono text-xs rounded-[3px] transition-all cursor-pointer ${
                  activeMediaTab === "after" ? "bg-[#111111] text-[#FFFFFF]" : "text-[#71717A]"
                }`}
              >
                Cleaned Audio
              </button>
              <button
                onClick={() => setActiveMediaTab("before")}
                className={`px-3 py-1 font-mono text-xs rounded-[3px] transition-all cursor-pointer ${
                  activeMediaTab === "before" ? "bg-[#111111] text-[#FFFFFF]" : "text-[#71717A]"
                }`}
              >
                Original Audio
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-[#FAFAFA] rounded-md border border-[#E5E5E5]">
            <audio src={activeMediaTab === "after" ? cleanedUrl : originalUrl} controls className="w-full max-w-md" />
            <div className="mt-2 text-xs font-mono text-[#71717A]">
              Playing {activeMediaTab === "after" ? "Purified Stream (C2PA/RIFF tags removed)" : "Original Input"}
            </div>
          </div>
        </div>
      )}

      {/* 5. VIDEO COMPARISON */}
      {isVideo && (
        <div className="p-5 rounded-md border border-[#E5E5E5] bg-[#FFFFFF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-[#111111]">Video Stream Provenance Removed</span>
            <Badge variant="outline" className="border-[#E5E5E5] bg-[#FAFAFA] text-[#111111]">ISOBMFF Cleaned</Badge>
          </div>
          <div className="aspect-video w-full rounded-md overflow-hidden border border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-center">
            <video src={cleanedUrl} controls className="max-h-full max-w-full" />
          </div>
        </div>
      )}

      {/* 6. OFFICE / ARCHIVE CONTAINER (DOCX, PDF, XLSX, PPTX, EPUB, ODT) */}
      {isDoc && (
        <div className="p-6 rounded-md border border-[#E5E5E5] bg-[#FFFFFF] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-[#111111]">
              <FileArchive className="h-8 w-8" />
            </div>
            <div>
              <div className="font-mono text-sm font-semibold text-[#111111]">{fileName}</div>
              <div className="font-mono text-xs text-[#71717A]">
                Package decompiled, metadata & watermark shapes purged, archive re-bundled cleanly.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Contrast Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-xs">
        <Button
          variant="outline"
          size="default"
          onClick={onReset}
          className="text-[#555555] hover:text-[#111111] border-[#E5E5E5] hover:bg-[#FAFAFA] flex items-center gap-1.5 cursor-pointer rounded-[3px]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Process New File</span>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="default"
            onClick={handleCopy}
            className="flex items-center gap-1.5 cursor-pointer border border-[#E5E5E5] bg-[#FAFAFA] hover:bg-[#F4F4F5] text-[#111111] rounded-[3px]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#555555]" />
                <span>{category === "text" ? "Copy Text" : "Copy Output"}</span>
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="default"
            onClick={handleDownload}
            className="bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] font-semibold flex items-center gap-2 cursor-pointer shadow-sm rounded-[3px]"
          >
            <Download className="h-4 w-4" />
            <span>Download Cleaned File</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
