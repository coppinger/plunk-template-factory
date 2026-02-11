"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeEditor } from "@/components/editor/code-editor";
import { supabaseVariables } from "@/lib/mock-data";
import type { TemplateType, TemplateVariant } from "@/lib/types";
import { BODY_PLACEHOLDER } from "@/lib/types";
import { StyleEditorTab } from "@/components/editor/style-editor-tab";
import type { TemplateStyle } from "@/lib/types";
import {
  Copy,
  Check,
  Plus,
  CopyPlus,
  Trash2,
  Info,
  Palette,
} from "lucide-react";
import { useState } from "react";

interface EditorPanelProps {
  selectedType: TemplateType;
  editingGlobal: boolean;
  subject: string;
  html: string;
  onSubjectChange: (subject: string) => void;
  onHtmlChange: (html: string) => void;
  variants: TemplateVariant[];
  activeVariantId: string;
  onVariantSelect: (id: string) => void;
  onVariantCreate: () => void;
  onVariantDuplicate: (id: string) => void;
  onVariantDelete: (id: string) => void;
  templateStyle?: TemplateStyle;
  onStyleChange?: (updates: Partial<TemplateStyle>) => void;
}

export function EditorPanel({
  selectedType,
  editingGlobal,
  subject,
  html,
  onSubjectChange,
  onHtmlChange,
  variants,
  activeVariantId,
  onVariantSelect,
  onVariantCreate,
  onVariantDuplicate,
  onVariantDelete,
  templateStyle,
  onStyleChange,
}: EditorPanelProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const filteredVars = editingGlobal
    ? supabaseVariables
    : supabaseVariables.filter((v) => v.availableFor.includes(selectedType));

  function copyVariable(syntax: string) {
    navigator.clipboard.writeText(syntax);
    setCopiedVar(syntax);
    setTimeout(() => setCopiedVar(null), 1500);
  }

  if (editingGlobal) {
    return (
      <div className="flex h-full w-[520px] shrink-0 flex-col border-l bg-white">
        <Tabs defaultValue="edit" className="flex h-full flex-col">
          <div className="border-b px-4">
            <TabsList className="h-10 w-full justify-start gap-2 bg-transparent p-0">
              <TabsTrigger
                value="edit"
                className="h-10 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-2.5 text-xs font-medium data-[state=active]:border-foreground data-[state=active]:shadow-none"
              >
                Edit
              </TabsTrigger>
              <TabsTrigger
                value="style"
                className="h-10 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-2.5 text-xs font-medium data-[state=active]:border-foreground data-[state=active]:shadow-none gap-1"
              >
                <Palette className="h-3 w-3" />
                Style
              </TabsTrigger>
              <TabsTrigger
                value="variables"
                className="h-10 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-2.5 text-xs font-medium data-[state=active]:border-foreground data-[state=active]:shadow-none"
              >
                Variables
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="edit" className="flex-1 flex flex-col mt-0 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <div className="flex items-start gap-2 rounded-md bg-blue-50 p-2.5 text-[12px] leading-relaxed text-blue-700">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  This is the shared email wrapper. Use <code className="rounded bg-blue-100 px-1 font-mono text-[11px]">{BODY_PLACEHOLDER}</code> as the placeholder where each template&apos;s body content will be inserted.
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor value={html} onChange={onHtmlChange} />
            </div>
          </TabsContent>

          <TabsContent value="style" className="flex-1 mt-0 overflow-hidden">
            {templateStyle && onStyleChange && (
              <StyleEditorTab style={templateStyle} onChange={onStyleChange} />
            )}
          </TabsContent>

          <TabsContent value="variables" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                {filteredVars.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <code className="text-xs font-mono font-medium text-foreground">
                        {v.syntax}
                      </code>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyVariable(v.syntax)}
                        >
                          {copiedVar === v.syntax ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy syntax</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[520px] shrink-0 flex-col border-l bg-white">
      <Tabs defaultValue="edit" className="flex h-full flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10 w-full justify-start gap-2 bg-transparent p-0">
            <TabsTrigger
              value="edit"
              className="h-10 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-2.5 text-xs font-medium data-[state=active]:border-foreground data-[state=active]:shadow-none"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="variables"
              className="h-10 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-2.5 text-xs font-medium data-[state=active]:border-foreground data-[state=active]:shadow-none"
            >
              Variables
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="h-10 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-2.5 text-xs font-medium data-[state=active]:border-foreground data-[state=active]:shadow-none"
            >
              Variants
              {variants.length > 1 && (
                <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                  {variants.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 flex flex-col mt-0 overflow-hidden">
          <div className="px-4 py-3 border-b">
            <Label htmlFor="subject" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Subject Line
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="mt-1.5 h-8 text-sm"
              placeholder="Email subject..."
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor value={html} onChange={onHtmlChange} />
          </div>
        </TabsContent>

        <TabsContent value="variables" className="flex-1 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-1">
              {filteredVars.map((v) => (
                <div
                  key={v.name}
                  className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-mono font-medium text-foreground">
                      {v.syntax}
                    </code>
                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyVariable(v.syntax)}
                      >
                        {copiedVar === v.syntax ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy syntax</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="variants" className="flex-1 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Variants
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={onVariantCreate}
                >
                  <Plus className="h-3 w-3" />
                  New
                </Button>
              </div>

              <div className="space-y-1.5">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => onVariantSelect(variant.id)}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${
                      activeVariantId === variant.id
                        ? "border-foreground bg-secondary"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {variant.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {variant.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onVariantDuplicate(variant.id);
                            }}
                          >
                            <CopyPlus className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicate</TooltipContent>
                      </Tooltip>
                      {variants.length > 1 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onVariantDelete(variant.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
