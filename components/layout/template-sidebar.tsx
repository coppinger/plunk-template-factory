"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  onTypeChange: (type: TemplateType) => void;
  variantCounts: Record<TemplateType, number>;
}

export function TemplateSidebar({
  selectedType,
  onTypeChange,
  variantCounts,
}: TemplateSidebarProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const filteredVars = supabaseVariables.filter((v) =>
    v.availableFor.includes(selectedType)
  );

  function copyVariable(syntax: string) {
    navigator.clipboard.writeText(syntax);
    setCopiedVar(syntax);
    setTimeout(() => setCopiedVar(null), 1500);
  }

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r bg-white">
      <div className="px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Templates
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          {templateTypes.map((t) => {
            const Icon = iconMap[t.icon];
            const isActive = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTypeChange(t.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span className="flex-1 truncate">{t.label}</span>
                {variantCounts[t.id] > 1 && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-[20px] justify-center px-1.5 text-[10px] font-medium"
                  >
                    {variantCounts[t.id]}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <Separator className="my-3" />

        <div className="px-4 pb-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Variables
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Available for {templateTypes.find((t) => t.id === selectedType)?.label}
          </p>
        </div>

        <div className="px-2 pb-4">
          {filteredVars.map((v) => (
            <Tooltip key={v.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => copyVariable(v.syntax)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-muted group"
                >
                  <code className="flex-1 text-xs font-mono text-foreground">
                    {v.syntax}
                  </code>
                  {copiedVar === v.syntax ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-xs">{v.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
