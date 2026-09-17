/**
 * Multi-Format Curated Preset Samples
 * Includes PNG, explicit JPEG (.jpg/.jpeg), SVG, Markdown, and WAV Audio.
 */

import { FileCategory } from "./watermark-engine";

export interface SamplePreset {
  id: string;
  name: string;
  fileName: string;
  category: FileCategory;
  typeLabel: string;
  description: string;
  watermarkDescription: string;
  generateFile: () => Promise<File>;
}

// 1. Image Portrait (PNG)
function makePortraitImage(): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, "#1c1917");
  bgGrad.addColorStop(0.5, "#292524");
  bgGrad.addColorStop(1, "#0c0a09");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  const radGrad = ctx.createRadialGradient(512, 450, 40, 512, 450, 420);
  radGrad.addColorStop(0, "rgba(217, 119, 6, 0.45)");
  radGrad.addColorStop(0.4, "rgba(180, 83, 9, 0.2)");
  radGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.fillStyle = "#18181b";
  ctx.beginPath();
  ctx.arc(512, 400, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(512, 750, 320, 220, 0, 0, Math.PI);
  ctx.fill();

  // Translucent corner watermark
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 22px monospace";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 4;
  ctx.fillText("AI GENERATED // SEED: 8941042", 560, 940);
  ctx.font = "15px monospace";
  ctx.fillStyle = "rgba(220, 220, 220, 0.85)";
  ctx.fillText("PROVENANCE: C2PA-JUMB-V1", 560, 970);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], "ai-portrait-c2pa.png", { type: "image/png" }));
    }, "image/png");
  });
}

// 2. Editorial Architecture (JPEG / .jpg)
function makeJpegStockImage(): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext("2d")!;

  // Neutral architectural gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
  bgGrad.addColorStop(0, "#27272a");
  bgGrad.addColorStop(0.5, "#3f3f46");
  bgGrad.addColorStop(1, "#18181b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Geometric facades
  ctx.fillStyle = "#52525b";
  ctx.fillRect(120, 180, 400, 620);
  ctx.fillStyle = "#71717a";
  ctx.fillRect(600, 260, 420, 540);

  // Windows grid
  ctx.fillStyle = "#a1a1aa";
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 4; c++) {
      ctx.fillRect(160 + c * 80, 220 + r * 100, 50, 70);
    }
  }

  // Diagonal translucent stock watermark pattern
  ctx.save();
  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = "bold 44px sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  for (let x = -300; x < 1500; x += 360) {
    for (let y = -150; y < 1200; y += 200) {
      ctx.fillText("GETTY PROOF", x, y);
    }
  }
  ctx.restore();

  // Bottom watermark stamp
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.font = "bold 20px monospace";
  ctx.fillText("© 2026 EDITORIAL ARCHIVE • PROOF ONLY", 680, 750);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], "architectural-stock.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.95);
  });
}

// 3. Vector SVG with Watermark Text & Metadata
function makeSvgDiagram(): Promise<File> {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <metadata>
    <c2pa:provenance xmlns:c2pa="http://c2pa.org/spec">
      <c2pa:claim generator="AI-Vector-Studio" timestamp="2026-09-17"/>
    </c2pa:provenance>
  </metadata>
  <rect width="800" height="500" fill="#f4f4f5"/>
  <rect x="50" y="80" width="200" height="120" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
  <text x="70" y="140" fill="#18181b" font-family="monospace" font-size="16">Ingestion Queue</text>
  <path d="M 250 140 L 350 140" stroke="#71717a" stroke-width="2"/>
  <rect x="350" y="80" width="200" height="120" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
  <text x="370" y="140" fill="#18181b" font-family="monospace" font-size="16">Tensor Inpainting</text>
  <path d="M 550 140 L 650 140" stroke="#71717a" stroke-width="2"/>
  <rect x="650" y="80" width="100" height="120" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
  <text x="665" y="140" fill="#059669" font-family="monospace" font-size="14">Cleaned</text>
  <g class="watermark-overlay" opacity="0.35">
    <text x="240" y="320" fill="#dc2626" font-family="sans-serif" font-weight="bold" font-size="42" transform="rotate(-15 400 300)">CONFIDENTIAL // AI DRAFT</text>
  </g>
  <text class="watermark" x="480" y="470" fill="rgba(0,0,0,0.6)" font-family="monospace" font-size="14">WATERMARK SAMPLE — PREVIEW ONLY</text>
</svg>`;
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  return Promise.resolve(new File([blob], "system-architecture.svg", { type: "image/svg+xml" }));
}

// 4. Markdown Document with Zero-Width Steganography & AI Frontmatter
function makeMarkdownDoc(): Promise<File> {
  const content = `---
title: Neural Synthesis Architecture
author: Autonomous Intelligence
generator: ChatGPT-4o
model: gpt-4o-2026-08-06
ai_generated: true
c2pa_manifest: urn:c2pa:claim:9847192
---

# Neural Synthesis Architecture

Modern image restoration uses spatial\u200B tensor\u200C diffusion\u200D to predict missing pixel fields.

## Methodology

1. High-frequency edge gradient inspection
2. Fast Marching Laplacian Boundary diffusion
3. Chromatic balance regularization

> [!NOTE]
> This document was generated with automated provenance hooks.
`;
  const blob = new Blob([content], { type: "text/markdown" });
  return Promise.resolve(new File([blob], "neural-synthesis.md", { type: "text/markdown" }));
}

// 5. Audio WAV with RIFF metadata
function makeAudioSample(): Promise<File> {
  const sampleRate = 8000;
  const numSamples = sampleRate;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.sin((i / sampleRate) * 440 * Math.PI * 2);
    view.setInt16(44 + i * 2, s * 8000, true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return Promise.resolve(new File([blob], "voice-memo-synthetic.wav", { type: "audio/wav" }));
}

export const MULTI_FORMAT_SAMPLES: SamplePreset[] = [
  {
    id: "sample-ai-portrait",
    name: "AI Studio Portrait",
    fileName: "ai-portrait-c2pa.png",
    category: "image",
    typeLabel: "PNG Image",
    description: "Generative model portrait with embedded C2PA manifest & translucent bottom watermark.",
    watermarkDescription: "Translucent text stamp & C2PA-JUMB manifest",
    generateFile: makePortraitImage,
  },
  {
    id: "sample-jpeg-stock",
    name: "Editorial Architecture",
    fileName: "architectural-stock.jpg",
    category: "image",
    typeLabel: "JPEG Image",
    description: "High-contrast architectural photograph with diagonal stock watermark grid & corner stamp.",
    watermarkDescription: "Diagonal stock grid & proof stamp (.jpg)",
    generateFile: makeJpegStockImage,
  },
  {
    id: "sample-svg-diagram",
    name: "Vector Tech Architecture",
    fileName: "system-architecture.svg",
    category: "image",
    typeLabel: "SVG Vector",
    description: "Vector infrastructure schematic with 'CONFIDENTIAL // AI DRAFT' watermark.",
    watermarkDescription: "Vector text overlay & <metadata> block",
    generateFile: makeSvgDiagram,
  },
  {
    id: "sample-markdown-doc",
    name: "Neural Whitepaper",
    fileName: "neural-synthesis.md",
    category: "text",
    typeLabel: "Markdown Document",
    description: "Technical paper containing zero-width steganographic tokens and ChatGPT YAML frontmatter.",
    watermarkDescription: "Zero-width unicode & AI YAML metadata",
    generateFile: makeMarkdownDoc,
  },
  {
    id: "sample-audio-memo",
    name: "Acoustic Voice Memo",
    fileName: "voice-memo-synthetic.wav",
    category: "audio",
    typeLabel: "WAV Audio",
    description: "Synthetic audio stream with RIFF INFO AI provenance carrier tags.",
    watermarkDescription: "RIFF INFO & synthetic provenance tags",
    generateFile: makeAudioSample,
  },
];
