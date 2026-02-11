"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteVariantDialogProps {
  open: boolean;
  variantName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteVariantDialog({
  open,
  variantName,
  onConfirm,
  onCancel,
}: DeleteVariantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-[400px] bg-[#161619] border-border/40">
        <DialogHeader>
          <DialogTitle className="text-[15px]">Delete variant</DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground/80">&ldquo;{variantName}&rdquo;</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[13px] border-border/40"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-[13px]"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
