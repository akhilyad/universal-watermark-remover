import React from "react";
import { ShieldCheck } from "lucide-react";

export type NavTab = "home" | "features" | "pricing";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  backendConnected?: boolean;
  backendVersion?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-[#FFFFFF] transition-colors">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab("home")}
            className="flex items-center gap-2.5 text-left cursor-pointer select-none group"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-[#111111] text-[#FFFFFF]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight text-[#111111]">
              WATERMARK<span className="text-[#888888]">//</span>REMOVER
            </span>
          </button>

          {/* Navigation Links: Home, Features, Pricing */}
          <nav className="hidden md:flex items-center gap-1 border-l border-[#E5E5E5] pl-5">
            {(
              [
                { id: "home", label: "Home" },
                { id: "features", label: "Features" },
                { id: "pricing", label: "Pricing" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium tracking-tight rounded-[3px] transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#111111] text-[#FFFFFF]"
                    : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F5]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-[#E5E5E5] px-4 py-1.5 gap-1 bg-[#FAFAFA]">
        {(
          [
            { id: "home", label: "Home" },
            { id: "features", label: "Features" },
            { id: "pricing", label: "Pricing" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 py-1 text-xs font-medium text-center rounded-[3px] transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#111111] text-[#FFFFFF]"
                : "text-[#555555] hover:text-[#111111]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
