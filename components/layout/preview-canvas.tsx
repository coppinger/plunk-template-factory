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
  const width = device === "desktop" ? 600 : 375;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 overflow-hidden">
      <div className="flex-1 flex items-start justify-center overflow-auto p-6">
        <div
          className="bg-white rounded-lg shadow-sm border transition-all duration-300 overflow-hidden"
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

      <div className="flex items-center justify-center border-t bg-white py-2.5">
        <ToggleGroup
          type="single"
          value={device}
          onValueChange={(v) => {
            if (v) onDeviceChange(v as "desktop" | "mobile");
          }}
          className="gap-1"
        >
          <ToggleGroupItem value="desktop" className="h-8 px-3 text-xs gap-1.5">
            <Monitor className="h-3.5 w-3.5" />
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" className="h-8 px-3 text-xs gap-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
