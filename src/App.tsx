import React, { useState, useEffect, useRef } from "react";
import { Navbar, NavTab } from "@/components/navbar";
import { FeaturesSection } from "@/components/features-section";
import { PricingSection } from "@/components/pricing-section";
import { Dropzone } from "@/components/dropzone";
import { ThinkingPanel } from "@/components/thinking-panel";
import { ComparisonSlider } from "@/components/comparison-slider";
import { AuditPanel } from "@/components/audit-panel";
import { ErrorBanner } from "@/components/error-banner";
import {
  processFileRemoval,
  checkBackendHealth,
  WatermarkResult,
  getFileInfo,
  getPipelineStagesForCategory,
  FileCategory,
} from "@/lib/watermark-engine";
import { Sparkles, Sliders } from "lucide-react";

type AppState = "IDLE" | "PROCESSING" | "COMPLETED" | "ERROR";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    version?: string;
  }>({ connected: false });

  // Processing state telemetry
  const [currentStage, setCurrentStage] = useState(1);
  const [currentStageName, setCurrentStageName] = useState("Analyzing...");
  const [currentStages, setCurrentStages] = useState<{ id: number; label: string }[]>([]);
  const [loaderVariant, setLoaderVariant] = useState<"Drive" | "Dots" | "Orbit">("Drive");

  // File & media context
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [activePreviewEl, setActivePreviewEl] = useState<
    HTMLImageElement | HTMLVideoElement | HTMLAudioElement | null
  >(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FileCategory>("image");

  // Result & Error
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Abort Controller for clean cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus({ connected: res.ok, version: res.version });
    });
  }, []);

  // Handle file selection from dropzone
  const handleFileSelected = (
    file: File,
    previewEl?: HTMLImageElement | HTMLVideoElement | HTMLAudioElement | null
  ) => {
    setActiveTab("home");
    const info = getFileInfo(file.name);
    setActiveFile(file);
    setActivePreviewEl(previewEl || null);
    setActiveCategory(info.category);
    const objectUrl = URL.createObjectURL(file);
    setOriginalUrl(objectUrl);
    startPipeline(file, previewEl || null, info.category);
  };

  // Start multi-modal removal pipeline
  const startPipeline = async (
    file: File,
    previewEl: HTMLImageElement | HTMLVideoElement | HTMLAudioElement | null,
    category: FileCategory
  ) => {
    const stages = getPipelineStagesForCategory(category);
    setCurrentStages(stages);
    setAppState("PROCESSING");
    setCurrentStage(1);
    setCurrentStageName(stages[0].label);
    setErrorMessage(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const output = await processFileRemoval(file, previewEl, {
        signal: controller.signal,
        onProgress: (stage, stageName) => {
          setCurrentStage(stage);
          setCurrentStageName(stageName);
        },
      });

      setResult(output);
      setAppState("COMPLETED");
    } catch (err: any) {
      if (err.name === "AbortError") {
        setAppState("IDLE");
      } else {
        setErrorMessage(
          err?.message || "Failed to sanitize file provenance and watermark markers."
        );
        setAppState("ERROR");
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Cancel ongoing pipeline
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Retry on error
  const handleRetry = () => {
    if (activeFile) {
      startPipeline(activeFile, activePreviewEl, activeCategory);
    } else {
      setAppState("IDLE");
    }
  };

  // Reset to IDLE
  const handleReset = () => {
    setAppState("IDLE");
    setActiveFile(null);
    setActivePreviewEl(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl(null);
    setResult(null);
    setErrorMessage(null);
  };

  const handleSelectTab = (tab: NavTab) => {
    if (tab === "home") {
      handleReset();
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-[#FFFFFF]">
      {/* Top Editorial Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 sm:px-6 md:py-12 flex flex-col items-center justify-start">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* TAB 1: HOME WORKFLOW */}
          {activeTab === "home" && (
            <>
              {/* Editorial Hero Header (Visible in IDLE state) */}
              {appState === "IDLE" && (
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-1 text-xs shadow-2xs">
                    <Sparkles className="h-3.5 w-3.5 text-[#111111]" />
                    <span className="font-mono text-[#111111] font-medium">
                      AI-Watermark Remover
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
                    Purify 22 Formats Across Media & Code
                  </h1>
                  <p className="text-sm sm:text-base text-[#666666] font-normal leading-relaxed max-w-2xl mx-auto">
                    Strip C2PA manifests, visual watermarks, AI generator headers, and zero-width
                    steganography across images, documents, audio, video, and prose.
                  </p>
                </div>
              )}

              {/* Loader Variant Selector */}
              {appState === "PROCESSING" && (
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#71717A]">
                  <span className="flex items-center gap-1 text-[#111111] font-medium">
                    <Sliders className="h-3 w-3" /> Vector Variant:
                  </span>
                  {(["Drive", "Dots", "Orbit"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setLoaderVariant(v)}
                      className={`px-2 py-0.5 rounded-[3px] cursor-pointer transition-colors ${
                        loaderVariant === v
                          ? "bg-[#111111] text-[#FFFFFF] font-medium shadow-xs"
                          : "text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}

              {/* 1. IDLE / STAGING STATE */}
              {appState === "IDLE" && (
                <Dropzone
                  onFileSelected={handleFileSelected}
                  isProcessing={false}
                />
              )}

              {/* 2. PROCESSING (THINKING STATE) */}
              {appState === "PROCESSING" && (
                <div className="flex flex-col items-center justify-center py-6 space-y-6 w-full animate-in fade-in duration-200">
                  <ThinkingPanel
                    currentStage={currentStage}
                    currentStageName={currentStageName}
                    stages={currentStages}
                    isProcessing={true}
                    isCompleted={false}
                    onCancel={handleCancel}
                    variant={loaderVariant}
                  />
                </div>
              )}

              {/* 3. ERROR STATE */}
              {appState === "ERROR" && errorMessage && (
                <div className="py-4 w-full animate-in fade-in duration-200">
                  <ErrorBanner
                    error={errorMessage}
                    onRetry={handleRetry}
                    onDismiss={handleReset}
                  />
                </div>
              )}

              {/* 4. COMPLETED / OUTPUT STATE */}
              {appState === "COMPLETED" && result && originalUrl && (
                <div className="space-y-6 w-full animate-in fade-in duration-300">
                  {/* Compact Thinking Summary Pill ("Thought for 3.8s") */}
                  <ThinkingPanel
                    currentStage={4}
                    currentStageName="Finished"
                    stages={currentStages}
                    isProcessing={false}
                    isCompleted={true}
                    durationMs={result.report.durationMs}
                  />

                  {/* Multi-Modal Comparison & Output View */}
                  <ComparisonSlider
                    originalUrl={originalUrl}
                    cleanedUrl={result.cleanedUrl}
                    cleanedBlob={result.cleanedBlob}
                    fileName={activeFile?.name}
                    category={activeCategory}
                    textBefore={result.textBefore}
                    textAfter={result.textAfter}
                    onReset={handleReset}
                  />

                  {/* Provenance Audit Report Card */}
                  <AuditPanel report={result.report} />
                </div>
              )}
            </>
          )}

          {/* TAB 2: FEATURES SECTION */}
          {activeTab === "features" && (
            <div className="animate-in fade-in duration-200 w-full">
              <FeaturesSection />
            </div>
          )}

          {/* TAB 3: PRICING SECTION */}
          {activeTab === "pricing" && (
            <div className="animate-in fade-in duration-200 w-full">
              <PricingSection />
            </div>
          )}
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="w-full border-t border-[#E5E5E5] bg-[#FFFFFF] py-6 text-center text-xs font-mono text-[#71717A]">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
            <span className="text-[#111111] font-medium">22 Formats Supported • In-Memory Processing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
