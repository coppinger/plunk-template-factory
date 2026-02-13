"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, FileCode, FileText, Files } from "lucide-react";

export type ExportFormat = "html" | "text" | "both";

interface ExportAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
}

const FORMAT_OPTIONS: {
  value: ExportFormat;
  label: string;
  description: string;
  icon: typeof FileCode;
}[] = [
  {
    value: "both",
    label: "Both HTML & plain text",
    description: "HTML and plain text for every variant",
    icon: Files,
  },
  {
    value: "html",
    label: "HTML only",
    description: "Composed HTML files for each template variant",
    icon: FileCode,
  },
  {
    value: "text",
    label: "Plain text only",
    description: "Plain text versions of each template",
    icon: FileText,
  },
];

export function ExportAllDialog({
  open,
  onOpenChange,
  onExport,
  isExporting,
}: ExportAllDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("both");

  const handleOpenChange = useCallback(
    (o: boolean) => {
      if (isExporting) return;
      if (!o) setFormat("both");
      onOpenChange(o);
    },
    [isExporting, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Export All Templates</DialogTitle>
          <DialogDescription>
            Export every template type and variant as a ZIP file.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={format}
          onValueChange={(v) => setFormat(v as ExportFormat)}
          className="gap-2 py-2"
        >
          {FORMAT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <Label
                key={opt.value}
                htmlFor={`format-${opt.value}`}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  format === opt.value
                    ? "border-primary/40 bg-primary/[0.06]"
                    : "border-border/40 hover:bg-secondary/50"
                }`}
              >
                <RadioGroupItem
                  value={opt.value}
                  id={`format-${opt.value}`}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {opt.label}
                  </div>
                  <p className="text-[13px] text-muted-foreground font-normal leading-snug">
                    {opt.description}
                  </p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button onClick={() => onExport(format)} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Exporting...
              </>
            ) : (
              "Export ZIP"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
