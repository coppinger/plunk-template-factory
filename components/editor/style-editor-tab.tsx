"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TemplateStyle } from "@/lib/types";
import { DEFAULT_STYLE } from "@/lib/types";
import { Info, RotateCcw } from "lucide-react";

interface StyleEditorTabProps {
  style: TemplateStyle;
  onChange: (updates: Partial<TemplateStyle>) => void;
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-muted-foreground/70 w-[120px] shrink-0">
        {label}
      </Label>
      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 shrink-0 cursor-pointer rounded-md border border-border/50 bg-secondary p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 text-sm font-mono flex-1 bg-secondary/50 border-border/50"
        />
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-muted-foreground/70 w-[120px] shrink-0">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 text-sm flex-1 bg-secondary/50 border-border/50"
      />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-2">
      {title}
    </p>
  );
}

export function StyleEditorTab({ style, onChange }: StyleEditorTabProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">
        <div className="flex items-start gap-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10 p-2.5 text-sm leading-relaxed text-amber-300/80">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400/60" />
          <span>These styles apply to all templates and variants.</span>
        </div>

        {/* Brand */}
        <div>
          <SectionHeader title="Brand" />
          <div className="space-y-2">
            <TextField
              label="Brand Name"
              value={style.brandName}
              onChange={(v) => onChange({ brandName: v })}
            />
            <ColorField
              label="Brand Color"
              value={style.brandColor}
              onChange={(v) => onChange({ brandColor: v })}
            />
          </div>
        </div>

        <div className="h-px bg-border/30" />

        {/* Colors */}
        <div>
          <SectionHeader title="Colors" />
          <div className="space-y-2">
            <ColorField
              label="Background"
              value={style.backgroundColor}
              onChange={(v) => onChange({ backgroundColor: v })}
            />
            <ColorField
              label="Container"
              value={style.containerBackground}
              onChange={(v) => onChange({ containerBackground: v })}
            />
            <ColorField
              label="Heading"
              value={style.headingColor}
              onChange={(v) => onChange({ headingColor: v })}
            />
            <ColorField
              label="Body Text"
              value={style.bodyColor}
              onChange={(v) => onChange({ bodyColor: v })}
            />
          </div>
        </div>

        <div className="h-px bg-border/30" />

        {/* Buttons */}
        <div>
          <SectionHeader title="Buttons" />
          <div className="space-y-2">
            <ColorField
              label="Background"
              value={style.buttonBackground}
              onChange={(v) => onChange({ buttonBackground: v })}
            />
            <ColorField
              label="Text"
              value={style.buttonTextColor}
              onChange={(v) => onChange({ buttonTextColor: v })}
            />
            <TextField
              label="Border Radius"
              value={style.buttonRadius}
              onChange={(v) => onChange({ buttonRadius: v })}
            />
          </div>
        </div>

        <div className="h-px bg-border/30" />

        {/* Container */}
        <div>
          <SectionHeader title="Container" />
          <div className="space-y-2">
            <TextField
              label="Border Radius"
              value={style.containerRadius}
              onChange={(v) => onChange({ containerRadius: v })}
            />
          </div>
        </div>

        <div className="h-px bg-border/30" />

        {/* Typography */}
        <div>
          <SectionHeader title="Typography" />
          <div className="space-y-2">
            <TextField
              label="Font Family"
              value={style.fontFamily}
              onChange={(v) => onChange({ fontFamily: v })}
            />
            <TextField
              label="Heading Size"
              value={style.headingSize}
              onChange={(v) => onChange({ headingSize: v })}
            />
            <TextField
              label="Body Size"
              value={style.bodySize}
              onChange={(v) => onChange({ bodySize: v })}
            />
          </div>
        </div>

        <div className="h-px bg-border/30" />

        {/* Footer */}
        <div>
          <SectionHeader title="Footer" />
          <div className="space-y-2">
            <ColorField
              label="Text"
              value={style.footerColor}
              onChange={(v) => onChange({ footerColor: v })}
            />
            <ColorField
              label="Link"
              value={style.footerLinkColor}
              onChange={(v) => onChange({ footerLinkColor: v })}
            />
          </div>
        </div>

        <div className="h-px bg-border/30" />

        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm gap-1.5 border-border/50 text-muted-foreground hover:text-foreground"
          onClick={() => onChange({ ...DEFAULT_STYLE })}
        >
          <RotateCcw className="h-3 w-3" />
          Reset to Defaults
        </Button>
      </div>
    </ScrollArea>
  );
}
