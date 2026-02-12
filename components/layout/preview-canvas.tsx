"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Monitor, Smartphone, ZoomIn, ZoomOut, Code, FileText } from "lucide-react";

interface PreviewCanvasProps {
  html: string;
  plainText: string;
  previewMode: "html" | "text";
  onPreviewModeChange: (mode: "html" | "text") => void;
  device: "desktop" | "mobile";
  onDeviceChange: (device: "desktop" | "mobile") => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function PreviewCanvas({
  html,
  plainText,
  previewMode,
  onPreviewModeChange,
  device,
  onDeviceChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: PreviewCanvasProps) {
  const width = device === "desktop" ? 700 : 375;

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative">
      <div className="flex-1 flex items-start justify-center overflow-auto canvas-grid p-8">
        <div
          className="relative bg-white rounded-lg elevation-2 border border-white/[0.08] transition-all duration-300 ease-out overflow-hidden"
          style={{
            width,
            minHeight: 400,
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
        >
          {previewMode === "html" ? (
            <iframe
              srcDoc={html}
              title="Email preview"
              className="w-full border-0"
              style={{ height: 700, width: "100%" }}
              sandbox="allow-same-origin"
            />
          ) : (
            <pre className="w-full p-6 text-[13px] leading-relaxed text-neutral-800 font-mono whitespace-pre-wrap break-words overflow-auto" style={{ minHeight: 700 }}>
              {plainText}
            </pre>
          )}
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={previewMode}
          onValueChange={(v) => {
            if (v) onPreviewModeChange(v as "html" | "text");
          }}
          className="gap-0.5 rounded-full bg-[#141418]/95 backdrop-blur-md p-1 border border-border/40 elevation-2"
        >
          <ToggleGroupItem value="html" className="h-7 px-3 text-[13px] gap-1.5 rounded-full data-[state=on]:bg-white/[0.08] data-[state=on]:text-foreground text-muted-foreground transition-all duration-150">
            <Code className="h-3 w-3" />
            HTML
          </ToggleGroupItem>
          <ToggleGroupItem value="text" className="h-7 px-3 text-[13px] gap-1.5 rounded-full data-[state=on]:bg-white/[0.08] data-[state=on]:text-foreground text-muted-foreground transition-all duration-150">
            <FileText className="h-3 w-3" />
            Text
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="single"
          value={device}
          onValueChange={(v) => {
            if (v) onDeviceChange(v as "desktop" | "mobile");
          }}
          className="gap-0.5 rounded-full bg-[#141418]/95 backdrop-blur-md p-1 border border-border/40 elevation-2"
        >
          <ToggleGroupItem value="desktop" className="h-7 px-3 text-[13px] gap-1.5 rounded-full data-[state=on]:bg-white/[0.08] data-[state=on]:text-foreground text-muted-foreground transition-all duration-150">
            <Monitor className="h-3 w-3" />
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" className="h-7 px-3 text-[13px] gap-1.5 rounded-full data-[state=on]:bg-white/[0.08] data-[state=on]:text-foreground text-muted-foreground transition-all duration-150">
            <Smartphone className="h-3 w-3" />
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-0.5 rounded-full bg-[#141418]/95 backdrop-blur-md p-1 border border-border/40 elevation-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground"
                onClick={onZoomOut}
                disabled={zoom <= 0.3}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onZoomReset}
                className="h-7 min-w-[42px] px-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full"
              >
                {Math.round(zoom * 100)}%
              </button>
            </TooltipTrigger>
            <TooltipContent>Reset zoom</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground"
                onClick={onZoomIn}
                disabled={zoom >= 2}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
