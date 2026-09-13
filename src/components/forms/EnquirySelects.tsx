import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  FileText,
  Layers,
  Mountain,
  Ruler,
  Ship,
  Sparkles,
} from "lucide-react";

export interface GraniteOption {
  id: string;
  name: string;
  subtitle: string;
  swatchType: "galaxy" | "steel" | "pearl" | "tan" | "absolute" | "viscont" | "colonial" | "multi";
}

export const GRANITE_VARIETIES: GraniteOption[] = [
  {
    id: "Black Galaxy (Captive Mine)",
    name: "Black Galaxy",
    subtitle: "Chimakurthy Quarry",
    swatchType: "galaxy",
  },
  {
    id: "Steel Grey",
    name: "Steel Grey",
    subtitle: "Prakasam",
    swatchType: "steel",
  },
  {
    id: "Black Pearl",
    name: "Black Pearl",
    subtitle: "South India",
    swatchType: "pearl",
  },
  {
    id: "Tan Brown",
    name: "Tan Brown",
    subtitle: "Karimnagar",
    swatchType: "tan",
  },
  {
    id: "Absolute Black",
    name: "Absolute Black",
    subtitle: "Warangal",
    swatchType: "absolute",
  },
  {
    id: "Viscont White",
    name: "Viscont White",
    subtitle: "Madanapalle",
    swatchType: "viscont",
  },
  {
    id: "Colonial White",
    name: "Colonial White",
    subtitle: "South India",
    swatchType: "colonial",
  },
  {
    id: "Other / Mixed Consignment",
    name: "Multi-variety Consignment",
    subtitle: "Custom Selection",
    swatchType: "multi",
  },
];

export interface ProcessingOption {
  id: string;
  title: string;
  spec: string;
  icon: React.ElementType;
}

export const PROCESSING_TYPES: ProcessingOption[] = [
  {
    id: "Gang-saw Slabs (20mm / 30mm)",
    title: "Gang-saw Polished Slabs",
    spec: "20mm & 30mm • Jumbo format",
    icon: Layers,
  },
  {
    id: "Cutter Slabs",
    title: "Cutter Slabs",
    spec: "Countertop & flooring dimensions",
    icon: Ruler,
  },
  {
    id: "Export Container Order (FOB/CIF)",
    title: "Ocean Container Order",
    spec: "Full 20ft container load",
    icon: Ship,
  },
  {
    id: "Cut-to-Size / Commercial Project",
    title: "Cut-to-Size Project",
    spec: "Architectural & facade cuts",
    icon: Building2,
  },
  {
    id: "Rough Blocks",
    title: "Rough Blocks",
    spec: "Direct quarry dressed blocks",
    icon: Mountain,
  },
  {
    id: "General Technical & Pricing Query",
    title: "General Enquiry & Price List",
    spec: "Pricing & specifications",
    icon: FileText,
  },
];

function MineralSwatch({ type }: { type: GraniteOption["swatchType"] }) {
  switch (type) {
    case "galaxy":
      return (
        <span
          className="inline-flex size-3.5 shrink-0 rounded-full border border-amber-400/80 shadow-[0_0_6px_rgba(234,179,8,0.25)]"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #59441a 0%, #151108 50%, #060502 100%)",
          }}
        />
      );
    case "steel":
      return (
        <span
          className="inline-flex size-3.5 shrink-0 rounded-full border border-stone-400/60"
          style={{
            background:
              "linear-gradient(135deg, #5b6267 0%, #34393d 50%, #222629 100%)",
          }}
        />
      );
    case "pearl":
      return (
        <span
          className="inline-flex size-3.5 shrink-0 rounded-full border border-stone-500/60"
          style={{
            background:
              "radial-gradient(circle, #2d3339 10%, #14171a 70%, #0a0b0d 100%)",
          }}
        />
      );
    case "tan":
      return (
        <span
          className="inline-flex size-3.5 shrink-0 rounded-full border border-amber-900/80"
          style={{
            background:
              "radial-gradient(circle, #4d2315 20%, #281109 70%, #120703 100%)",
          }}
        />
      );
    case "absolute":
      return (
        <span className="inline-flex size-3.5 shrink-0 rounded-full border border-stone-600/80 bg-black" />
      );
    case "viscont":
      return (
        <span
          className="inline-flex size-3.5 shrink-0 rounded-full border border-stone-300/80"
          style={{
            background:
              "linear-gradient(45deg, #e5e5e5 25%, #737373 50%, #262626 75%)",
          }}
        />
      );
    case "colonial":
      return (
        <span
          className="inline-flex size-3.5 shrink-0 rounded-full border border-stone-400/80"
          style={{
            background:
              "radial-gradient(circle, #f5f0e6 40%, #c4baa7 80%, #8c7d67 100%)",
          }}
        />
      );
    case "multi":
    default:
      return (
        <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/20 text-primary">
          <Sparkles className="size-2" />
        </span>
      );
  }
}

interface GraniteVarietySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export function GraniteVarietySelect({ value, onChange }: GraniteVarietySelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selected: GraniteOption =
    GRANITE_VARIETIES.find((opt) => opt.id === value || opt.name === value) ||
    (GRANITE_VARIETIES[0] as GraniteOption);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
        Granite Variety *
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`group relative flex w-full items-center justify-between gap-3 border px-4 py-3.5 text-left text-sm transition-all duration-200 cursor-pointer ${
          open
            ? "border-primary bg-background/10 ring-1 ring-primary/40"
            : "border-background/20 bg-background/5 hover:border-primary/50 hover:bg-background/8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <MineralSwatch type={selected.swatchType} />
          <span className="font-medium text-background tracking-wide truncate">
            {selected.name}
          </span>
        </div>

        <ChevronDown
          className={`size-4 shrink-0 text-background/60 transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : "group-hover:text-background"
          }`}
        />
      </button>

      {/* Floating Menu */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-md border border-background/25 bg-[#141519] shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="max-h-72 overflow-y-auto p-1.5 divide-y divide-background/5">
            {GRANITE_VARIETIES.map((opt) => {
              const isSelected = selected.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`group relative flex w-full items-center justify-between gap-3 p-3 text-left transition-all cursor-pointer rounded-sm ${
                    isSelected
                      ? "bg-primary/15 border-l-2 border-primary"
                      : "hover:bg-background/10 hover:border-l-2 hover:border-l-primary/60 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <MineralSwatch type={opt.swatchType} />
                    <div className="min-w-0">
                      <span
                        className={`text-sm font-medium tracking-wide ${
                          isSelected ? "text-primary" : "text-background group-hover:text-primary transition-colors"
                        }`}
                      >
                        {opt.name}
                      </span>
                      <p className="text-xs text-background/50 leading-tight truncate mt-0.5">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProcessingTypeSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export function ProcessingTypeSelect({ value, onChange }: ProcessingTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selected: ProcessingOption =
    PROCESSING_TYPES.find((opt) => opt.id === value || opt.title === value) ||
    (PROCESSING_TYPES[0] as ProcessingOption);

  const IconComponent = selected.icon;

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
        Order / Processing Type *
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`group relative flex w-full items-center justify-between gap-3 border px-4 py-3.5 text-left text-sm transition-all duration-200 cursor-pointer ${
          open
            ? "border-primary bg-background/10 ring-1 ring-primary/40"
            : "border-background/20 bg-background/5 hover:border-primary/50 hover:bg-background/8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-primary">
            <IconComponent className="size-3.5" />
          </div>
          <span className="font-medium text-background tracking-wide truncate">
            {selected.title}
          </span>
        </div>

        <ChevronDown
          className={`size-4 shrink-0 text-background/60 transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : "group-hover:text-background"
          }`}
        />
      </button>

      {/* Floating Menu */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-md border border-background/25 bg-[#141519] shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="max-h-72 overflow-y-auto p-1.5 divide-y divide-background/5">
            {PROCESSING_TYPES.map((opt) => {
              const isSelected = selected.id === opt.id;
              const ItemIcon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`group relative flex w-full items-center justify-between gap-3 p-3 text-left transition-all cursor-pointer rounded-sm ${
                    isSelected
                      ? "bg-primary/15 border-l-2 border-primary"
                      : "hover:bg-background/10 hover:border-l-2 hover:border-l-primary/60 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-sm transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/10 text-background/70 group-hover:bg-primary/20 group-hover:text-primary"
                      }`}
                    >
                      <ItemIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-sm font-medium tracking-wide ${
                          isSelected ? "text-primary" : "text-background group-hover:text-primary transition-colors"
                        }`}
                      >
                        {opt.title}
                      </span>
                      <p className="text-xs text-background/50 leading-tight truncate mt-0.5">
                        {opt.spec}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
