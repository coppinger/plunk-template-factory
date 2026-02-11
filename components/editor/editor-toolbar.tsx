"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wand2, Code2, Variable, Loader2 } from "lucide-react";
import { useState } from "react";
import type { SupabaseVariable } from "@/lib/types";

const wrapTags = [
  { label: "<a>", tag: "a" },
  { label: "<strong>", tag: "strong" },
  { label: "<em>", tag: "em" },
  { label: "<p>", tag: "p" },
  { label: "<span>", tag: "span" },
  { label: "<td>", tag: "td" },
];

interface EditorToolbarProps {
  variables: SupabaseVariable[];
  onFormat: () => Promise<void>;
  onWrap: (tag: string) => void;
  onInsertVariable: (syntax: string) => void;
}

export function EditorToolbar({
  variables,
  onFormat,
  onWrap,
  onInsertVariable,
}: EditorToolbarProps) {
  const [formatting, setFormatting] = useState(false);

  async function handleFormat() {
    setFormatting(true);
    try {
      await onFormat();
    } finally {
      setFormatting(false);
    }
  }

  return (
    <div className="flex items-center gap-0.5 px-3 py-1 bg-secondary/20 border-b border-border/30" style={{ height: 36 }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleFormat}
            disabled={formatting}
          >
            {formatting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wand2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Format HTML</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <Code2 className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Wrap selection</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="min-w-[120px]">
          {wrapTags.map((t) => (
            <DropdownMenuItem
              key={t.tag}
              className="text-[13px] font-mono"
              onClick={() => onWrap(t.tag)}
            >
              {t.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <Variable className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Insert variable</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          {variables.map((v) => (
            <DropdownMenuItem
              key={v.name}
              className="text-[13px] font-mono"
              onClick={() => onInsertVariable(v.syntax)}
            >
              {v.syntax}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
