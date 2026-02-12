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
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { DeleteVariantDialog } from "@/components/layout/delete-variant-dialog";
import type { TemplateType, TemplateVariant, TemplateVariable } from "@/lib/types";
import { BODY_PLACEHOLDER } from "@/lib/types";
import { StyleEditorTab } from "@/components/editor/style-editor-tab";
import type { TemplateStyle } from "@/lib/types";
import { formatHtml } from "@/lib/format-html";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Plus,
  CopyPlus,
  Trash2,
  Info,
  Palette,
  Pencil,
  ArrowDownToLine,
} from "lucide-react";
import { useState, useRef, type RefObject } from "react";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";

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
  onVariantRename: (id: string, name: string) => void;
  filteredVariables: TemplateVariable[];
  templateStyle?: TemplateStyle;
  onStyleChange?: (updates: Partial<TemplateStyle>) => void;
  editorRef: RefObject<ReactCodeMirrorRef | null>;
}

function insertAtCursor(ref: RefObject<ReactCodeMirrorRef | null>, text: string) {
  const view = ref.current?.view;
  if (!view) return;
  const { from, to } = view.state.selection.main;
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
  });
  view.focus();
}

function wrapSelection(ref: RefObject<ReactCodeMirrorRef | null>, tag: string) {
  const view = ref.current?.view;
  if (!view) return;
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  const wrapped = `<${tag}>${selected}</${tag}>`;
  view.dispatch({
    changes: { from, to, insert: wrapped },
    selection: { anchor: from + wrapped.length },
  });
  view.focus();
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
  onVariantRename,
  filteredVariables,
  templateStyle,
  onStyleChange,
  editorRef,
}: EditorPanelProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  const filteredVars = filteredVariables;

  function copyVariable(syntax: string) {
    navigator.clipboard.writeText(syntax);
    setCopiedVar(syntax);
    toast("Copied", { description: syntax });
    setTimeout(() => setCopiedVar(null), 1500);
  }

  function startRename(variant: TemplateVariant) {
    setEditingName(variant.id);
    setEditNameValue(variant.name);
    setTimeout(() => renameInputRef.current?.select(), 0);
  }

  function commitRename() {
    if (editingName && editNameValue.trim()) {
      onVariantRename(editingName, editNameValue.trim());
    }
    setEditingName(null);
  }

  async function handleFormat() {
    try {
      const formatted = await formatHtml(html);
      onHtmlChange(formatted);
      toast.success("HTML formatted");
    } catch {
      toast.error("Failed to format HTML");
    }
  }

  const tabTriggerClass =
    "h-8 rounded-md px-3 text-[13px] font-medium text-muted-foreground data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors duration-150";

  const variablesList = (vars: TemplateVariable[], showInsert: boolean) => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-1">
        {vars.map((v) => (
          <div
            key={v.name}
            className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors duration-150 group"
          >
            <div className="flex-1 min-w-0">
              <code className="text-[13px] font-mono font-medium text-foreground/90">
                {v.syntax}
              </code>
              <p className="mt-0.5 text-[13px] text-muted-foreground/60 leading-relaxed">
                {v.description}
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {showInsert && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => insertAtCursor(editorRef, v.syntax)}
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert at cursor</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyVariable(v.syntax)}
                  >
                    {copiedVar === v.syntax ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy syntax</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  if (editingGlobal) {
    return (
      <div className="flex h-full w-full shrink-0 flex-col border-l border-border/40 bg-[#111114]">
        <Tabs defaultValue="edit" className="flex h-full flex-col">
          <div className="border-b border-border/40 px-3">
            <TabsList className="h-10 w-full justify-start gap-0.5 bg-transparent p-0">
              <div className="flex items-center gap-0.5 bg-secondary/50 p-0.5 rounded-lg my-1">
                <TabsTrigger value="edit" className={tabTriggerClass}>
                  Edit
                </TabsTrigger>
                <TabsTrigger value="style" className={`${tabTriggerClass} gap-1`}>
                  <Palette className="h-3 w-3" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="variables" className={tabTriggerClass}>
                  Variables
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="edit" className="flex-1 flex flex-col mt-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/40">
              <div className="flex items-start gap-2 rounded-lg bg-sky-500/[0.06] border border-sky-500/10 p-2.5 text-[13px] leading-relaxed text-sky-300/80">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-sky-400/60" />
                <span>
                  This is the shared email wrapper. Use <code className="rounded bg-sky-500/10 px-1 font-mono text-xs text-sky-300">{BODY_PLACEHOLDER}</code> as the placeholder where each template&apos;s body content will be inserted.
                </span>
              </div>
            </div>
            <EditorToolbar
              variables={filteredVars}
              onFormat={handleFormat}
              onWrap={(tag) => wrapSelection(editorRef, tag)}
              onInsertVariable={(syntax) => insertAtCursor(editorRef, syntax)}
            />
            <div className="flex-1 overflow-hidden">
              <CodeEditor ref={editorRef} value={html} onChange={onHtmlChange} />
            </div>
          </TabsContent>

          <TabsContent value="style" className="flex-1 mt-0 overflow-hidden">
            {templateStyle && onStyleChange && (
              <StyleEditorTab style={templateStyle} onChange={onStyleChange} />
            )}
          </TabsContent>

          <TabsContent value="variables" className="flex-1 mt-0 overflow-hidden">
            {variablesList(filteredVars, true)}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-l border-border/40 bg-[#111114]">
      <Tabs defaultValue="edit" className="flex h-full flex-col">
        <div className="border-b border-border/40 px-3">
          <TabsList className="h-10 w-full justify-start gap-0.5 bg-transparent p-0">
            <div className="flex items-center gap-0.5 bg-secondary/50 p-0.5 rounded-lg my-1">
              <TabsTrigger value="edit" className={tabTriggerClass}>
                Edit
              </TabsTrigger>
              <TabsTrigger value="variables" className={tabTriggerClass}>
                Variables
              </TabsTrigger>
              <TabsTrigger value="variants" className={tabTriggerClass}>
                Variants
                {variants.length > 1 && (
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-xs bg-accent border border-border/30">
                    {variants.length}
                  </Badge>
                )}
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 flex flex-col mt-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40">
            <Label htmlFor="subject" className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
              Subject Line
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="mt-1.5 h-8 text-sm bg-secondary/40 border-border/40 focus:border-primary/40"
              placeholder="Email subject..."
            />
          </div>
          <EditorToolbar
            variables={filteredVars}
            onFormat={handleFormat}
            onWrap={(tag) => wrapSelection(editorRef, tag)}
            onInsertVariable={(syntax) => insertAtCursor(editorRef, syntax)}
          />
          <div className="flex-1 overflow-hidden">
            <CodeEditor ref={editorRef} value={html} onChange={onHtmlChange} />
          </div>
        </TabsContent>

        <TabsContent value="variables" className="flex-1 mt-0 overflow-hidden">
          {variablesList(filteredVars, true)}
        </TabsContent>

        <TabsContent value="variants" className="flex-1 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
                  Variants
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[13px] gap-1 border-border/40 text-muted-foreground hover:text-foreground"
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
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-all duration-150 ${
                      activeVariantId === variant.id
                        ? "border-primary/40 bg-primary/[0.06] elevation-1"
                        : "border-border/30 hover:bg-accent hover:border-border/50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {editingName === variant.id ? (
                        <Input
                          ref={renameInputRef}
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename();
                            if (e.key === "Escape") setEditingName(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 text-sm px-1 py-0 bg-secondary/50 border-primary/30"
                          autoFocus
                        />
                      ) : (
                        <p
                          className={`text-sm truncate ${activeVariantId === variant.id ? "font-medium text-foreground" : "text-foreground/80"}`}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            startRename(variant);
                          }}
                        >
                          {variant.name}
                        </p>
                      )}
                      <p className="text-[13px] text-muted-foreground/50 truncate">
                        {variant.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(variant);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rename</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-foreground"
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
                              className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget({ id: variant.id, name: variant.name });
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

          <DeleteVariantDialog
            open={deleteTarget !== null}
            variantName={deleteTarget?.name ?? ""}
            onConfirm={() => {
              if (deleteTarget) {
                onVariantDelete(deleteTarget.id);
                toast.success(`Deleted "${deleteTarget.name}"`);
              }
              setDeleteTarget(null);
            }}
            onCancel={() => setDeleteTarget(null)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
