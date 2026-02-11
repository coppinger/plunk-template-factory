"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { templateTypes, supabaseVariables } from "@/lib/mock-data";
import type { TemplateType } from "@/lib/types";
import {
  UserCheck,
  UserPlus,
  Sparkles,
  MailWarning,
  KeyRound,
  ShieldCheck,
  LayoutTemplate,
  Copy,
  Check,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { toast } from "sonner";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  UserCheck,
  UserPlus,
  Sparkles,
  MailWarning,
  KeyRound,
  ShieldCheck,
};

interface TemplateSidebarProps {
  selectedType: TemplateType;
  editingGlobal: boolean;
  onTypeChange: (type: TemplateType) => void;
  onEditGlobal: () => void;
  variantCounts: Record<TemplateType, number>;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function TemplateSidebar({
  selectedType,
  editingGlobal,
  onTypeChange,
  onEditGlobal,
  variantCounts,
  collapsed,
  onToggleCollapse,
}: TemplateSidebarProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const filteredVars = editingGlobal
    ? supabaseVariables
    : supabaseVariables.filter((v) => v.availableFor.includes(selectedType));

  function copyVariable(syntax: string) {
    navigator.clipboard.writeText(syntax);
    setCopiedVar(syntax);
    toast("Copied", { description: syntax });
    setTimeout(() => setCopiedVar(null), 1500);
  }

  if (collapsed) {
    return (
      <div className="flex h-full w-full shrink-0 flex-col border-r border-border/40 bg-[#111114]">
        <div className="flex items-center justify-center py-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col items-center gap-0.5 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEditGlobal}
                  className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-150 ${
                    editingGlobal
                      ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-[3px] border-transparent"
                  }`}
                >
                  <LayoutTemplate className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Base Template</TooltipContent>
            </Tooltip>

            <div className="my-1 w-5 h-px bg-border/20" />

            {templateTypes.map((t) => {
              const Icon = iconMap[t.icon];
              const isActive = !editingGlobal && selectedType === t.id;
              return (
                <Tooltip key={t.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onTypeChange(t.id)}
                      className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-150 ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-[3px] border-transparent"
                      }`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {t.label}
                    {variantCounts[t.id] > 1 && ` (${variantCounts[t.id]})`}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-r border-border/40 bg-[#111114]">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
          Templates
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground/50 hover:text-foreground"
          onClick={onToggleCollapse}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          <button
            onClick={onEditGlobal}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150 ${
              editingGlobal
                ? "bg-primary/10 text-primary font-medium border-l-[3px] border-primary ml-0"
                : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-[3px] border-transparent"
            }`}
          >
            <LayoutTemplate className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">Base Template</span>
          </button>

          <div className="my-2 mx-3 h-px bg-border/20" />

          {templateTypes.map((t) => {
            const Icon = iconMap[t.icon];
            const isActive = !editingGlobal && selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTypeChange(t.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-l-[3px] border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-[3px] border-transparent"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="flex-1 truncate">{t.label}</span>
                {variantCounts[t.id] > 1 && (
                  <Badge
                    variant="secondary"
                    className="h-[18px] min-w-[18px] justify-center px-1.5 text-xs font-medium bg-accent border border-border/30"
                  >
                    {variantCounts[t.id]}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {!editingGlobal && (
          <>
            <div className="my-3 mx-4 h-px bg-border/20" />

            <div className="px-4 pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
                Variables
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground/50">
                Available for {templateTypes.find((t) => t.id === selectedType)?.label}
              </p>
            </div>

            <div className="px-2 pb-4">
              {filteredVars.map((v) => (
                <Tooltip key={v.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyVariable(v.syntax)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-all duration-150 hover:bg-accent group"
                    >
                      <code className="flex-1 text-[13px] font-mono text-foreground/70">
                        {v.syntax}
                      </code>
                      {copiedVar === v.syntax ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    <p className="text-[13px]">{v.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}
