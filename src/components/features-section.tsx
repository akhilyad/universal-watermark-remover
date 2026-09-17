import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  ShieldCheck,
  FileCode,
  Cpu,
  EyeOff,
  Sparkles,
  Lock,
  Boxes,
  Zap,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const capabilities = [
    {
      icon: <Layers className="h-4 w-4 text-[#111111]" />,
      title: "22 Multi-Modal File Formats",
      badge: "Universal Dispatch",
      description:
        "Full format dispatch across raster & vector images (PNG, JPEG, WebP, AVIF, HEIC, BMP, GIF, TIFF, SVG), Office OpenXML documents (PDF, DOCX, XLSX, PPTX, EPUB, ODT), web markup (HTML, Markdown), video (MP4, MOV, M4V, M4A), and audio (WAV, MP3, FLAC).",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-[#111111]" />,
      title: "C2PA & Provenance Stripping",
      badge: "Standards Compliant",
      description:
        "Deep inspection and surgical removal of JUMB boxes, Adobe XMP packets, ContentCredentials metadata, and cryptographic assertion claims embedded by DALL-E, Midjourney, Adobe Firefly, and Stable Diffusion.",
    },
    {
      icon: <Sparkles className="h-4 w-4 text-[#111111]" />,
      title: "Laplacian Boundary Inpainting",
      badge: "Pixel Synthesis",
      description:
        "Iterative boundary diffusion reconstructs missing pixel fields underneath visual text stamps, translucent diagonal stock grids, and corner watermark badges with zero blur artifacts and continuous chromatic balance.",
    },
    {
      icon: <EyeOff className="h-4 w-4 text-[#111111]" />,
      title: "Zero-Width Steganography Neutralizer",
      badge: "Unicode Layer A",
      description:
        "Identifies and purges hidden invisible unicode tokens (\\u200B–\\u200D, \\uFEFF, \\u2060), homoglyph substitutions, and AI prompt metadata embedded in Markdown, HTML, and text payloads.",
    },
    {
      icon: <Boxes className="h-4 w-4 text-[#111111]" />,
      title: "Container & Atom Purification",
      badge: "ISOBMFF & OpenXML",
      description:
        "In-memory decompilation and sanitization of Zip packages (DOCX/XLSX/PPTX) and ISOBMFF video/audio containers, purging watermark shapes and ID3v2/RIFF INFO comment frames without re-encoding loss.",
    },
    {
      icon: <Lock className="h-4 w-4 text-[#111111]" />,
      title: "Air-Gapped In-Memory Security",
      badge: "Zero Retention",
      description:
        "Client-side Canvas and WebWorker execution means files are sanitized locally in-memory with zero cloud leakage, zero telemetry, and zero persistent storage on external servers.",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-8 space-y-8 animate-in fade-in duration-200">
      {/* Section Header */}
      <div className="space-y-2 border-b border-[#E5E5E5] pb-6">
        <Badge variant="outline" className="border-[#E5E5E5] text-[#111111] font-mono text-[10px] rounded-[3px]">
          TECHNICAL ARCHITECTURE
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
          Engine Capabilities & Verification Matrix
        </h2>
        <p className="text-sm text-[#666666] max-w-2xl">
          Engineered as an editorial-grade utility wrapping Guillaume Meyer&apos;s Python provenance
          sanitizer and high-order client inpainting kernels.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((cap, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-5 rounded-[4px] border border-[#E5E5E5] bg-[#FFFFFF] hover:border-[#111111] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-[#F4F4F5] border border-[#E5E5E5]">
                  {cap.icon}
                </div>
                <Badge variant="mono" className="text-[9px] border-[#E5E5E5] text-[#555555] bg-[#FAFAFA] rounded-[2px]">
                  {cap.badge}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-[#111111] tracking-tight">
                {cap.title}
              </h3>
              <p className="mt-2 text-xs text-[#555555] leading-relaxed font-normal">
                {cap.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0F0F0] text-[10px] font-mono text-[#888888]">
              Status: Converged & Verified
            </div>
          </div>
        ))}
      </div>

      {/* Codebase Specification Table */}
      <div className="rounded-[4px] border border-[#E5E5E5] bg-[#FAFAFA] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
          <span className="font-mono text-xs font-semibold text-[#111111] uppercase tracking-wider">
            Supported Extension Manifest
          </span>
          <span className="font-mono text-[11px] text-[#666666]">
            22 Formats Registered
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-[#333333]">
          <div>
            <div className="text-[10px] text-[#888888] uppercase mb-1">Raster / Vector</div>
            <div>.png, .jpg, .jpeg, .webp, .avif, .heic, .bmp, .gif, .tiff, .svg</div>
          </div>
          <div>
            <div className="text-[10px] text-[#888888] uppercase mb-1">Documents</div>
            <div>.pdf, .docx, .xlsx, .pptx, .epub, .odt</div>
          </div>
          <div>
            <div className="text-[10px] text-[#888888] uppercase mb-1">Text & Markup</div>
            <div>.html, .htm, .md, .markdown</div>
          </div>
          <div>
            <div className="text-[10px] text-[#888888] uppercase mb-1">Audio & Video</div>
            <div>.mp4, .mov, .m4v, .m4a, .wav, .mp3, .flac</div>
          </div>
        </div>
      </div>
    </section>
  );
};
