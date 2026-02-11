"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, Smartphone } from "lucide-react";

interface PreviewCanvasProps {
  html: string;
  device: "desktop" | "mobile";
  onDeviceChange: (device: "desktop" | "mobile") => void;
}

export function PreviewCanvas({
  html,
  device,
  onDeviceChange,
}: PreviewCanvasProps) {
  const width = device === "desktop" ? 700 : 375;

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative">
      <div className="flex-1 flex items-start justify-center overflow-auto canvas-grid p-8">
        <div
          className="bg-white rounded-xl shadow-2xl shadow-black/40 ring-1 ring-white/[0.06] transition-all duration-500 ease-out overflow-hidden"
          style={{ width, minHeight: 400 }}
        >
          <iframe
            srcDoc={html}
            title="Email preview"
            className="w-full border-0"
            style={{ height: 700, width: "100%" }}
            sandbox="allow-same-origin"
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <ToggleGroup
          type="single"
          value={device}
          onValueChange={(v) => {
            if (v) onDeviceChange(v as "desktop" | "mobile");
          }}
          className="gap-0.5 rounded-full bg-[#161619]/90 backdrop-blur-md p-1 border border-border/40 shadow-xl shadow-black/30"
        >
          <ToggleGroupItem value="desktop" className="h-7 px-3 text-[11px] gap-1.5 rounded-full data-[state=on]:bg-accent data-[state=on]:text-foreground text-muted-foreground transition-all duration-150">
            <Monitor className="h-3 w-3" />
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" className="h-7 px-3 text-[11px] gap-1.5 rounded-full data-[state=on]:bg-accent data-[state=on]:text-foreground text-muted-foreground transition-all duration-150">
            <Smartphone className="h-3 w-3" />
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
