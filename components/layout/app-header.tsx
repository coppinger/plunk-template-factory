"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { templateTypes } from "@/lib/mock-data";
import type { TemplateType } from "@/lib/types";
import { Copy, Download, Mail, LayoutTemplate } from "lucide-react";

interface AppHeaderProps {
  selectedType: TemplateType;
  editingGlobal: boolean;
  onTypeChange: (type: TemplateType) => void;
  onExport: () => void;
  onCopy: () => void;
}

export function AppHeader({
  selectedType,
  editingGlobal,
  onTypeChange,
  onExport,
  onCopy,
}: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border/50 bg-[#111114] px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 ring-1 ring-primary/20">
          <Mail className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Plunk
          </h1>
          <span className="text-[11px] text-muted-foreground font-medium tracking-tight">
            Template Factory
          </span>
        </div>
      </div>

      <div className="mx-4 h-4 w-px bg-border/40" />

      {editingGlobal ? (
        <div className="flex items-center gap-2 h-7 px-2.5 rounded-md bg-primary/[0.08] border border-primary/20 text-xs">
          <LayoutTemplate className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-medium text-primary">Base Template</span>
        </div>
      ) : (
        <Select value={selectedType} onValueChange={(v) => onTypeChange(v as TemplateType)}>
          <SelectTrigger className="w-[200px] h-7 text-xs bg-secondary/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {templateTypes.map((t) => (
              <SelectItem key={t.id} value={t.id} className="text-xs">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground" onClick={onCopy}>
          <Copy className="h-3 w-3" />
          Copy HTML
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground" onClick={onExport}>
          <Download className="h-3 w-3" />
          Export
        </Button>
      </div>
    </header>
  );
}
