"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProjectListItem } from "@/lib/persistence";
import {
  FolderOpen,
  ChevronDown,
  Plus,
  Pencil,
  CopyPlus,
  Trash2,
  Check,
} from "lucide-react";

interface ProjectSwitcherProps {
  projects: ProjectListItem[];
  activeProjectId: string | null;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => Promise<string | null>;
  onRename: (id: string, name: string) => Promise<boolean>;
  onDuplicate: (id: string, name: string) => Promise<string | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export function ProjectSwitcher({
  projects,
  activeProjectId,
  onSwitch,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
}: ProjectSwitcherProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [dialogName, setDialogName] = useState("");
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  function handleCreate() {
    setDialogName("");
    setShowCreateDialog(true);
  }

  function handleRename(id: string, currentName: string) {
    setTargetProjectId(id);
    setDialogName(currentName);
    setShowRenameDialog(true);
  }

  function handleDuplicate(id: string, currentName: string) {
    setTargetProjectId(id);
    setDialogName(`${currentName} (Copy)`);
    setShowDuplicateDialog(true);
  }

  function handleDelete(id: string) {
    setTargetProjectId(id);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-[13px] border-border/40 bg-secondary/50 max-w-[200px]"
          >
            <FolderOpen className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {activeProject?.name ?? "No Project"}
            </span>
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[260px]">
          {projects.map((p) => (
            <DropdownMenuItem
              key={p.id}
              className="flex items-center gap-2 group"
              onClick={() => onSwitch(p.id)}
            >
              <span className="flex-1 truncate text-[13px]">{p.name}</span>
              {p.id === activeProjectId && (
                <Check className="h-3 w-3 text-primary shrink-0" />
              )}
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(p.id, p.name);
                      }}
                      className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground/60 hover:text-foreground hover:bg-accent"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Rename</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(p.id, p.name);
                      }}
                      className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground/60 hover:text-foreground hover:bg-accent"
                    >
                      <CopyPlus className="h-2.5 w-2.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate</TooltipContent>
                </Tooltip>
                {projects.length > 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCreate} className="gap-2 text-[13px]">
            <Plus className="h-3 w-3" />
            New Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={dialogName}
              onChange={(e) => setDialogName(e.target.value)}
              placeholder="My Project"
              className="mt-1.5"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && dialogName.trim()) {
                  onCreate(dialogName.trim());
                  setShowCreateDialog(false);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!dialogName.trim()}
              onClick={() => {
                onCreate(dialogName.trim());
                setShowCreateDialog(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename-project">Project Name</Label>
            <Input
              id="rename-project"
              value={dialogName}
              onChange={(e) => setDialogName(e.target.value)}
              className="mt-1.5"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && dialogName.trim() && targetProjectId) {
                  onRename(targetProjectId, dialogName.trim());
                  setShowRenameDialog(false);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!dialogName.trim()}
              onClick={() => {
                if (targetProjectId) {
                  onRename(targetProjectId, dialogName.trim());
                }
                setShowRenameDialog(false);
              }}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Project Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Duplicate Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="duplicate-project">New Project Name</Label>
            <Input
              id="duplicate-project"
              value={dialogName}
              onChange={(e) => setDialogName(e.target.value)}
              className="mt-1.5"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && dialogName.trim() && targetProjectId) {
                  onDuplicate(targetProjectId, dialogName.trim());
                  setShowDuplicateDialog(false);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDuplicateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!dialogName.trim()}
              onClick={() => {
                if (targetProjectId) {
                  onDuplicate(targetProjectId, dialogName.trim());
                }
                setShowDuplicateDialog(false);
              }}
            >
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {projects.find((p) => p.id === targetProjectId)?.name}
            </strong>
            ? This action cannot be undone. All templates in this project will
            be permanently deleted.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (targetProjectId) {
                  onDelete(targetProjectId);
                }
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
