import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import {
  getFileInfo,
  SUPPORTED_EXTENSIONS,
  FileCategory,
  FileTypeInfo,
} from "@/lib/watermark-engine";
import { MULTI_FORMAT_SAMPLES, SamplePreset } from "@/lib/samples";
import {
  UploadCloud,
  FileImage,
  FileText,
  FileCode,
  FileAudio,
  FileVideo,
  FileArchive,
  AlertTriangle,
  X,
  Sparkles,
  CheckCircle2,
  File,
} from "lucide-react";

interface DropzoneProps {
  onFileSelected: (
    file: File,
    previewEl?: HTMLImageElement | HTMLVideoElement | HTMLAudioElement | null
  ) => void;
  isProcessing: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  isProcessing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  // Staged item state
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedInfo, setStagedInfo] = useState<FileTypeInfo | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string | null>(null);
  const [stagedTextSnippet, setStagedTextSnippet] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  // Validate contract: 22 supported formats, max 50MB
  const validateAndStageFile = useCallback(async (file: File) => {
    setErrorMessage(null);
    const info = getFileInfo(file.name);

    // 1. Check supported extensions
    const ext = info.extension.toLowerCase();
    if (!SUPPORTED_EXTENSIONS[ext]) {
      setErrorMessage(
        `Unsupported format (${ext || "unknown"}). Supported formats include: PNG, JPEG, WebP, AVIF, HEIC, BMP, GIF, TIFF, SVG, PDF, DOCX, XLSX, PPTX, EPUB, ODT, HTML, Markdown, MP4, MOV, M4V, M4A, WAV, MP3, FLAC.`
      );
      return;
    }

    // 2. File size cap: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File exceeds 50MB processing budget (${formatBytes(file.size)}).`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setStagedFile(file);
    setStagedInfo(info);
    setStagedPreviewUrl(objectUrl);

    // Category-specific previews
    if (info.category === "image" && !file.name.endsWith(".svg")) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = objectUrl;
    } else if (info.category === "text" || file.name.endsWith(".svg")) {
      try {
        const text = await file.text();
        setStagedTextSnippet(text.slice(0, 500));
      } catch {
        setStagedTextSnippet(null);
      }
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndStageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndStageFile(e.target.files[0]);
    }
  };

  const handleSelectPreset = async (preset: SamplePreset) => {
    setActivePreset(preset.id);
    const file = await preset.generateFile();
    await validateAndStageFile(file);
  };

  const handleClearStaged = () => {
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setStagedFile(null);
    setStagedInfo(null);
    setStagedPreviewUrl(null);
    setStagedTextSnippet(null);
    setDimensions(null);
    setActivePreset(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProceed = () => {
    if (!stagedFile) return;
    const preview =
      imagePreviewRef.current || videoPreviewRef.current || audioPreviewRef.current || null;
    onFileSelected(stagedFile, preview);
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to proceed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (stagedFile && !isProcessing) {
          handleProceed();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stagedFile, isProcessing]);

  // Filter presets
  const filteredPresets = MULTI_FORMAT_SAMPLES.filter((p) => {
    if (activeCategoryFilter === "all") return true;
    return p.category === activeCategoryFilter;
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.avif,.heic,.heif,.bmp,.gif,.tiff,.tif,.svg,.pdf,.docx,.xlsx,.pptx,.epub,.odt,.html,.htm,.md,.markdown,.mp4,.mov,.m4v,.m4a,.wav,.mp3,.flac"
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* STAGED VIEW */}
      {stagedFile && stagedInfo && stagedPreviewUrl ? (
        <div className="rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xs transition-all duration-200">
          {/* Staged Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <div className="flex items-center gap-2">
              {stagedInfo.category === "image" && <FileImage className="h-4 w-4 text-[#111111]" />}
              {stagedInfo.category === "document" && <FileArchive className="h-4 w-4 text-[#111111]" />}
              {stagedInfo.category === "text" && <FileCode className="h-4 w-4 text-[#111111]" />}
              {stagedInfo.category === "video" && <FileVideo className="h-4 w-4 text-[#111111]" />}
              {stagedInfo.category === "audio" && <FileAudio className="h-4 w-4 text-[#111111]" />}
              <span className="font-mono text-xs font-semibold text-[#111111] truncate max-w-[280px]">
                {stagedFile.name}
              </span>
              <Badge variant="mono" className="text-[10px] uppercase border-[#E5E5E5] bg-[#FAFAFA] text-[#111111]">
                {stagedInfo.label}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClearStaged}
              disabled={isProcessing}
              className="text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] cursor-pointer"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Replace
            </Button>
          </div>

          {/* Staged Preview HUD */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Visual preview box */}
            <div className="sm:col-span-6 relative aspect-video rounded-md overflow-hidden border border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-center">
              {stagedInfo.category === "image" ? (
                <img
                  ref={imagePreviewRef}
                  src={stagedPreviewUrl}
                  alt="Staged input"
                  className="max-h-full max-w-full object-contain"
                />
              ) : stagedInfo.category === "video" ? (
                <video
                  ref={videoPreviewRef}
                  src={stagedPreviewUrl}
                  controls
                  className="max-h-full max-w-full"
                />
              ) : stagedInfo.category === "audio" ? (
                <div className="flex flex-col items-center justify-center p-4 w-full">
                  <FileAudio className="h-10 w-10 text-[#71717A] mb-2" />
                  <audio ref={audioPreviewRef} src={stagedPreviewUrl} controls className="w-full max-w-[220px]" />
                </div>
              ) : (
                <div className="p-3 w-full h-full overflow-hidden font-mono text-[10px] text-[#555555] bg-[#FAFAFA] flex flex-col justify-start">
                  <div className="text-[#111111] font-semibold uppercase pb-1 border-b border-[#E5E5E5] mb-1">
                    Text / Structure Excerpt
                  </div>
                  <pre className="whitespace-pre-wrap font-mono line-clamp-6 text-[#111111]">
                    {stagedTextSnippet || "(Binary document package structure)"}
                  </pre>
                </div>
              )}
            </div>

            {/* Metadata and action trigger */}
            <div className="sm:col-span-6 space-y-3">
              <div className="space-y-1.5 font-mono text-xs text-[#555555]">
                <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
                  <span>File Size</span>
                  <span className="text-[#111111] font-semibold">{formatBytes(stagedFile.size)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
                  <span>Category</span>
                  <span className="text-[#111111] uppercase font-semibold">{stagedInfo.category}</span>
                </div>
                {dimensions && (
                  <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
                    <span>Dimensions</span>
                    <span className="text-[#111111] font-semibold">{dimensions.width} × {dimensions.height} px</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
                  <span>Provenance Target</span>
                  <span className="text-[#111111] font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#111111] animate-pulse" />
                    C2PA / AI Tagged
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleProceed}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] active:scale-[0.98] font-semibold tracking-tight shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#FFFFFF]" />
                  <span>Remove Watermark & Provenance</span>
                  <span className="hidden sm:inline font-mono text-[10px] bg-[#333333] text-[#FFFFFF] px-1.5 py-0.5 rounded ml-1">
                    ⌘↵
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* IDLE DROPZONE VIEW */
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 select-none ${
              isDragging
                ? "border-[#111111] bg-[#F4F4F5] scale-[1.005]"
                : "border-[#E5E5E5] bg-[#FAFAFA] hover:border-[#111111] hover:bg-[#F4F4F5]"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[#111111] group-hover:border-[#111111] group-hover:scale-105 transition-all shadow-xs">
              <UploadCloud className="h-6 w-6" />
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium text-[#111111]">
                Drop any image, document, audio, or video file, or{" "}
                <span className="text-[#111111] underline decoration-[#888888] underline-offset-4 group-hover:decoration-[#111111]">
                  browse
                </span>
              </p>
              <p className="text-xs text-[#71717A] font-mono">
                22 Formats Supported • Max 50MB
              </p>
            </div>

            {/* Supported Categories Pills */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-xl">
              <span className="font-mono text-[10px] text-[#444444] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded">
                Images (PNG, JPEG, WebP, AVIF, HEIC, BMP, GIF, TIFF, SVG)
              </span>
              <span className="font-mono text-[10px] text-[#444444] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded">
                Docs (PDF, DOCX, XLSX, PPTX, EPUB, ODT)
              </span>
              <span className="font-mono text-[10px] text-[#444444] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded">
                Web/Text (HTML, Markdown)
              </span>
              <span className="font-mono text-[10px] text-[#444444] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded">
                AV (MP4, MOV, M4V, M4A, WAV, MP3, FLAC)
              </span>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-between pb-2.5 text-[11px] font-mono text-[#71717A]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold text-[#111111]">
                <Sparkles className="h-3 w-3 text-[#111111]" />
                Or test with multi-modal preset:
              </span>

              {/* Category Filter */}
              <div className="flex items-center gap-1">
                {(["all", "image", "document", "text", "audio"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono cursor-pointer transition-colors ${
                      activeCategoryFilter === cat
                        ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                        : "text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex flex-col items-start p-3 rounded-md border text-left transition-all cursor-pointer ${
                    activePreset === preset.id
                      ? "border-[#111111] bg-[#FAFAFA] text-[#111111] shadow-xs"
                      : "border-[#E5E5E5] bg-[#FFFFFF] text-[#555555] hover:border-[#111111] hover:bg-[#FAFAFA] hover:text-[#111111]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-[#111111]">
                      {preset.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] py-0 uppercase border-[#E5E5E5] text-[#555555]">
                      {preset.typeLabel}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-[#666666] line-clamp-2">
                    {preset.description}
                  </p>
                  <div className="mt-2 text-[10px] text-[#111111] font-mono flex items-center gap-1 font-medium">
                    <span className="h-1 w-1 rounded-full bg-[#111111]" />
                    {preset.watermarkDescription}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
