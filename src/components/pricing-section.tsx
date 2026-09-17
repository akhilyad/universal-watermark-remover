import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Sparkles, Building2, Terminal } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      id: "hobbyist",
      name: "Free / Hobbyist",
      badge: "No Card Required",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Essential watermark and provenance sanitization for individuals and quick checks.",
      features: [
        "10 files / month",
        "Max 1080p resolution (1920×1080)",
        "Raster images (.png, .jpg, .jpeg, .webp)",
        "SVG vector & Markdown cleaning",
        "Zero-width unicode stripping",
        "Browser-local client processing",
        "Interactive Before/After split curtain",
      ],
      cta: "Current Plan",
      primary: false,
    },
    {
      id: "pro",
      name: "Pro Utility",
      badge: "Most Popular",
      monthlyPrice: 1,
      annualPrice: 1,
      description: "For designers, journalists, and power users needing full multi-modal media support.",
      features: [
        "500 files / month",
        "Full 4K resolution (up to 4096×4096)",
        "All 22 file formats included",
        "Office documents (DOCX, PDF, XLSX, PPTX)",
        "Audio & Video (WAV, MP3, MP4, MOV)",
        "Batch processing (up to 25 files at once)",
        "SynthID confidence scoring & C2PA audit",
        "Fast convergence (< 1.5s per image)",
      ],
      cta: "Upgrade to Pro ($1/mo)",
      primary: true,
    },
    {
      id: "enterprise",
      name: "Enterprise & API",
      badge: "On-Premise Ready",
      monthlyPrice: 89,
      annualPrice: 75,
      description: "High-throughput REST API and air-gapped Docker container deployment for engineering teams.",
      features: [
        "Unlimited file processing volume",
        "REST API access (POST /clean, /inspect)",
        "Uncapped resolution & arbitrary video lengths",
        "On-premise Docker / Python backend license",
        "Custom Layer B rewrite strategy hooks",
        "Dedicated rate limits & priority support SLA",
        "Zero data retention compliance certification",
      ],
      cta: "Contact Enterprise",
      primary: false,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-8 space-y-8 animate-in fade-in duration-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E5E5] pb-6 gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="border-[#E5E5E5] text-[#111111] font-mono text-[10px] rounded-[3px]">
            TRANSPARENT UTILITY PRICING
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
            Simple Compute-Based Plans
          </h2>
          <p className="text-sm text-[#666666] max-w-xl">
            Priced predictably around tensor compute footprint, format depth, and API throughput.
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center rounded-[3px] border border-[#E5E5E5] bg-[#FAFAFA] p-0.5">
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors cursor-pointer ${
              billingCycle === "annual"
                ? "bg-[#111111] text-[#FFFFFF] font-medium"
                : "text-[#666666] hover:text-[#111111]"
            }`}
          >
            Annual (-20%)
          </button>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#111111] text-[#FFFFFF] font-medium"
                : "text-[#666666] hover:text-[#111111]"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between p-6 rounded-[4px] border transition-all ${
                plan.primary
                  ? "border-[#111111] bg-[#FFFFFF] shadow-sm relative"
                  : "border-[#E5E5E5] bg-[#FAFAFA]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-[#111111] uppercase tracking-wider">
                    {plan.name}
                  </span>
                  <Badge
                    variant="mono"
                    className={`text-[9px] rounded-[2px] border ${
                      plan.primary
                        ? "border-[#111111] bg-[#111111] text-[#FFFFFF]"
                        : "border-[#E5E5E5] bg-[#FFFFFF] text-[#666666]"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
                    ${price}
                  </span>
                  <span className="text-xs font-mono text-[#666666]">
                    / month
                  </span>
                </div>
                {billingCycle === "annual" && price > 0 && (
                  <div className="text-[11px] font-mono text-[#888888] mt-0.5">
                    Billed annually (${price * 12}/yr)
                  </div>
                )}

                <p className="mt-3 text-xs text-[#555555] leading-relaxed border-b border-[#E5E5E5] pb-4 font-normal">
                  {plan.description}
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
                    Included Specifications
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#333333]">
                      <Check className="h-3.5 w-3.5 text-[#111111] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                <Button
                  variant={plan.primary ? "default" : "outline"}
                  size="default"
                  className={`w-full rounded-[3px] text-xs font-medium cursor-pointer ${
                    plan.primary
                      ? "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222]"
                      : "border-[#E5E5E5] bg-[#FFFFFF] text-[#111111] hover:bg-[#F4F4F5]"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compute Footprint Rationale Box */}
      <div className="rounded-[4px] border border-[#E5E5E5] bg-[#FFFFFF] p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#111111]">
          <Terminal className="h-4 w-4" />
          <span>Compute Footprint & Tier Allocation Rationale</span>
        </div>
        <p className="text-xs text-[#666666] leading-relaxed">
          <strong>Free Tier:</strong> Client-side Canvas inpainting & Layer A Unicode parsing run on your browser&apos;s local hardware with zero server compute costs.
          <br />
          <strong>Pro Tier:</strong> Heavy 4K Laplacian boundary diffusion and multi-part Office OpenXML archive reconstruction require larger memory allocations and multi-threaded worker pools.
          <br />
          <strong>Enterprise Tier:</strong> Dedicated Python FastAPI sidecars running ISOBMFF atom walking and high-concurrency batch jobs require managed server cores and isolated container environments.
        </p>
      </div>
    </section>
  );
};
