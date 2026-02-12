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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Mail,
  FileText,
  Send,
  Bell,
  Heart,
  Star,
  Zap,
  PartyPopper,
  Sparkles,
  UserCheck,
  UserPlus,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import type { TemplateTypeInfo, TemplateVariable, CustomTemplateType } from "@/lib/types";

const ICON_OPTIONS = [
  "Mail",
  "FileText",
  "Send",
  "Bell",
  "Heart",
  "Star",
  "Zap",
  "PartyPopper",
  "Sparkles",
  "UserCheck",
  "UserPlus",
  "KeyRound",
  "ShieldCheck",
] as const;

const iconComponents: Record<string, ComponentType<{ className?: string }>> = {
  Mail,
  FileText,
  Send,
  Bell,
  Heart,
  Star,
  Zap,
  PartyPopper,
  Sparkles,
  UserCheck,
  UserPlus,
  KeyRound,
  ShieldCheck,
};

interface VariableRow {
  name: string;
  description: string;
}

interface CreateCustomTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (info: TemplateTypeInfo, variables: TemplateVariable[]) => void;
}

export function CreateCustomTemplateDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateCustomTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Mail");
  const [variables, setVariables] = useState<VariableRow[]>([]);

  const reset = useCallback(() => {
    setName("");
    setDescription("");
    setIcon("Mail");
    setVariables([]);
  }, []);

  function addVariable() {
    setVariables((prev) => [...prev, { name: "", description: "" }]);
  }

  function removeVariable(index: number) {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariable(index: number, field: keyof VariableRow, value: string) {
    setVariables((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function handleSubmit() {
    if (!name.trim()) return;

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const id = `custom-${slug}` as CustomTemplateType;

    const variableSyntaxes = variables
      .filter((v) => v.name.trim())
      .map((v) => `{{${v.name.trim()}}}`);

    const info: TemplateTypeInfo = {
      id,
      label: name.trim(),
      description: description.trim() || `Custom template: ${name.trim()}`,
      icon,
      variables: variableSyntaxes,
      category: "custom",
      isBuiltIn: false,
    };

    const templateVars: TemplateVariable[] = variables
      .filter((v) => v.name.trim())
      .map((v) => ({
        name: v.name.trim(),
        syntax: `{{${v.name.trim()}}}`,
        description: v.description.trim() || v.name.trim(),
        availableFor: [id],
      }));

    onSubmit(info, templateVars);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Custom Template</DialogTitle>
          <DialogDescription>
            Define a new email template type with its own variables.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Member Accepted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Input
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Sent when a member is approved"
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => {
                  const Icon = iconComponents[opt];
                  return (
                    <SelectItem key={opt} value={opt}>
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        {opt}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Variables</Label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[13px] gap-1"
                onClick={addVariable}
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            {variables.length === 0 && (
              <p className="text-[13px] text-muted-foreground">
                No variables defined. Click &quot;Add&quot; to create one.
              </p>
            )}
            <div className="space-y-2">
              {variables.map((v, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      value={v.name}
                      onChange={(e) => updateVariable(i, "name", e.target.value)}
                      placeholder="Variable name"
                      className="h-8 text-sm"
                    />
                    {v.name.trim() && (
                      <p className="text-xs text-muted-foreground pl-1 font-mono">
                        {`{{${v.name.trim()}}}`}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      value={v.description}
                      onChange={(e) => updateVariable(i, "description", e.target.value)}
                      placeholder="Description"
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeVariable(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
