"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { templateTypes } from "@/lib/mock-data";
import type { TemplateType } from "@/lib/types";
import { Copy, Download, Mail, LayoutTemplate, ChevronRight } from "lucide-react";

interface AppHeaderProps {
  selectedType: TemplateType;
  editingGlobal: boolean;
  onTypeChange: (type: TemplateType) => void;
  onExport: () => void;
  onCopy: () => void;
  activeVariantName?: string;
}

export function AppHeader({
  selectedType,
  editingGlobal,
  onTypeChange,
  onExport,
  onCopy,
  activeVariantName,
}: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border/40 bg-[#111114] px-4 shadow-[0_1px_0_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/[0.12] ring-1 ring-primary/20">
          <Mail className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            Plunk Template Factory
          </h1>
        </div>
      </div>

      <div className="mx-4 h-4 w-px bg-border/40" />

      {editingGlobal ? (
        <div className="flex items-center gap-2 h-7 px-2.5 rounded-md bg-primary/[0.08] border border-primary/20 text-[13px]">
          <LayoutTemplate className="h-3 w-3 text-primary" />
          <span className="font-medium text-primary">Base Template</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <Select value={selectedType} onValueChange={(v) => onTypeChange(v as TemplateType)}>
            <SelectTrigger className="w-[200px] h-7 text-[13px] bg-secondary/50 border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateTypes.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-[13px]">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeVariantName && activeVariantName !== "Default" && (
            <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/70">{activeVariantName}</span>
            </div>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        <div className="mr-1 h-4 w-px bg-border/30" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[13px] gap-1.5 text-muted-foreground hover:text-foreground border-border/40"
              onClick={onCopy}
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Copy HTML <kbd className="ml-1.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">Ctrl+Shift+C</kbd></span>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[13px] gap-1.5 text-muted-foreground hover:text-foreground border-border/40"
              onClick={onExport}
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Export HTML <kbd className="ml-1.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">Ctrl+Shift+E</kbd></span>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
