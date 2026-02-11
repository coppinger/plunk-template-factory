"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <header className="flex h-14 shrink-0 items-center border-b bg-white px-4">
      <div className="flex items-center gap-2.5">
        <Mail className="h-5 w-5 text-foreground" />
        <h1 className="text-sm font-semibold tracking-tight">
          Plunk Template Factory
        </h1>
      </div>

      <Separator orientation="vertical" className="mx-4 h-6" />

      {editingGlobal ? (
        <div className="flex items-center gap-2 h-8 px-3 rounded-md border bg-secondary text-sm">
          <LayoutTemplate className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Base Template</span>
        </div>
      ) : (
        <Select value={selectedType} onValueChange={(v) => onTypeChange(v as TemplateType)}>
          <SelectTrigger className="w-[200px] h-8 text-xs">
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

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" />
          Copy HTML
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={onExport}>
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>
    </header>
  );
}
