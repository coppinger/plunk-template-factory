"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useState, type ComponentType } from "react";

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
}

export function TemplateSidebar({
  selectedType,
  editingGlobal,
  onTypeChange,
  onEditGlobal,
  variantCounts,
}: TemplateSidebarProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const filteredVars = editingGlobal
    ? supabaseVariables
    : supabaseVariables.filter((v) => v.availableFor.includes(selectedType));

  function copyVariable(syntax: string) {
    navigator.clipboard.writeText(syntax);
    setCopiedVar(syntax);
    setTimeout(() => setCopiedVar(null), 1500);
  }

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-border/50 bg-[#111114]">
      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">
          Templates
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          <button
            onClick={onEditGlobal}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-base transition-all duration-150 ${
              editingGlobal
                ? "bg-primary/[0.08] text-primary font-medium border-l-2 border-primary ml-0"
                : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-2 border-transparent"
            }`}
          >
            <LayoutTemplate className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">Base Template</span>
          </button>

          <div className="my-2 mx-3 h-px bg-border/30" />

          {templateTypes.map((t) => {
            const Icon = iconMap[t.icon];
            const isActive = !editingGlobal && selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTypeChange(t.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-base transition-all duration-150 ${
                  isActive
                    ? "bg-primary/[0.08] text-primary font-medium border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-2 border-transparent"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="flex-1 truncate">{t.label}</span>
                {variantCounts[t.id] > 1 && (
                  <Badge
                    variant="secondary"
                    className="h-[18px] min-w-[18px] justify-center px-1.5 text-xs font-medium bg-accent border border-border/50"
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
            <div className="my-3 mx-4 h-px bg-border/30" />

            <div className="px-4 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">
                Variables
              </p>
              <p className="mt-1 text-sm text-muted-foreground/50">
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
                      <code className="flex-1 text-sm font-mono text-foreground/70">
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
                    <p className="text-sm">{v.description}</p>
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
