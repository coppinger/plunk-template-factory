"use client";

import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectSwitcher } from "@/components/layout/project-switcher";
import type { TemplateType, TemplateTypeInfo } from "@/lib/types";
import type { ProjectListItem } from "@/lib/persistence";
import { Copy, Download, Mail, LayoutTemplate, ChevronRight, FileDown, FileUp, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface AppHeaderProps {
  selectedType: TemplateType;
  editingGlobal: boolean;
  onTypeChange: (type: TemplateType) => void;
  onExport: () => void;
  onCopy: () => void;
  activeVariantName?: string;
  allTemplateTypes: TemplateTypeInfo[];
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  user: User | null;
  onSignOut: () => void;
  projects: ProjectListItem[];
  activeProjectId: string | null;
  onProjectSwitch: (id: string) => void;
  onProjectCreate: (name: string) => Promise<string | null>;
  onProjectRename: (id: string, name: string) => Promise<boolean>;
  onProjectDuplicate: (id: string, name: string) => Promise<string | null>;
  onProjectDelete: (id: string) => Promise<boolean>;
}

export function AppHeader({
  selectedType,
  editingGlobal,
  onTypeChange,
  onExport,
  onCopy,
  activeVariantName,
  allTemplateTypes,
  onExportJson,
  onImportJson,
  user,
  onSignOut,
  projects,
  activeProjectId,
  onProjectSwitch,
  onProjectCreate,
  onProjectRename,
  onProjectDuplicate,
  onProjectDelete,
}: AppHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseTypes = allTemplateTypes.filter((t) => t.category === "supabase-auth");
  const customTypes = allTemplateTypes.filter((t) => t.category === "custom");

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "??";

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border/40 bg-[#111114] px-4 shadow-[0_1px_0_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/[0.12] ring-1 ring-primary/20">
          <Mail className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            Plunk Template Factory
          </h1>
        </div>
      </div>

      <div className="mx-4 h-4 w-px bg-border/40" />

      <ProjectSwitcher
        projects={projects}
        activeProjectId={activeProjectId}
        onSwitch={onProjectSwitch}
        onCreate={onProjectCreate}
        onRename={onProjectRename}
        onDuplicate={onProjectDuplicate}
        onDelete={onProjectDelete}
      />

      <div className="mx-2 h-4 w-px bg-border/40" />

      {editingGlobal ? (
        <div className="flex items-center gap-2 h-7 px-2.5 rounded-md bg-primary/[0.08] border border-primary/20 text-[13px]">
          <LayoutTemplate className="h-3 w-3 text-primary" />
          <span className="font-medium text-primary">Base Template</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <Select value={selectedType} onValueChange={(v) => onTypeChange(v as TemplateType)}>
            <SelectTrigger className="w-[200px] h-7 text-[13px] bg-secondary/50 border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Supabase Auth</SelectLabel>
                {supabaseTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-[13px]">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              {customTypes.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Custom</SelectLabel>
                  {customTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-[13px]">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          {activeVariantName && activeVariantName !== "Default" && (
            <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/70">{activeVariantName}</span>
            </div>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        <div className="mr-1 h-4 w-px bg-border/30" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[13px] gap-1.5 text-muted-foreground hover:text-foreground border-border/40"
              onClick={onCopy}
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Copy HTML <kbd className="ml-1.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">Ctrl+Shift+C</kbd></span>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[13px] gap-1.5 text-muted-foreground hover:text-foreground border-border/40"
              onClick={onExport}
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Export HTML <kbd className="ml-1.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">Ctrl+Shift+E</kbd></span>
          </TooltipContent>
        </Tooltip>

        <div className="mx-1 h-4 w-px bg-border/30" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[13px] gap-1.5 text-muted-foreground hover:text-foreground border-border/40"
              onClick={onExportJson}
            >
              <FileDown className="h-3 w-3" />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Save all templates as JSON</span>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[13px] gap-1.5 text-muted-foreground hover:text-foreground border-border/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="h-3 w-3" />
              Load
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Load templates from JSON</span>
          </TooltipContent>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImportJson(file);
              e.target.value = "";
            }
          }}
        />

        <div className="mx-1 h-4 w-px bg-border/30" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-2 px-1.5 text-muted-foreground hover:text-foreground">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-primary/[0.12] text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] max-w-[140px] truncate hidden sm:inline">
                {user?.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
