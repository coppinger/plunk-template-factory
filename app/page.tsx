"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { TemplateSidebar } from "@/components/layout/template-sidebar";
import { PreviewCanvas } from "@/components/layout/preview-canvas";
import { EditorPanel } from "@/components/layout/editor-panel";
import { CreateCustomTemplateDialog } from "@/components/layout/create-custom-template-dialog";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { useAuth } from "@/hooks/use-auth";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { applyStyleTokens } from "@/lib/utils";
import { SUPABASE_TEMPLATE_TYPES } from "@/lib/types";
import type { TemplateType } from "@/lib/types";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Home() {
  const auth = useAuth();
  const editor = useTemplateEditor({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
  });
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCopy = useCallback(() => {
    editor.copyHtml();
    toast.success("HTML copied to clipboard");
  }, [editor]);

  const handleExport = useCallback(() => {
    editor.exportHtml();
    toast.success("Template exported as HTML");
  }, [editor]);

  const handleVariantCreate = useCallback(() => {
    editor.createVariant();
    toast.success("Variant created");
  }, [editor]);

  const handleVariantDuplicate = useCallback(
    (id: string) => {
      editor.duplicateVariant(id);
      toast.success("Variant duplicated");
    },
    [editor]
  );

  const handleExportJson = useCallback(() => {
    editor.exportJson();
    toast.success("Templates exported as JSON");
  }, [editor]);

  const handleImportJson = useCallback(
    async (file: File) => {
      const success = await editor.importJson(file);
      if (success) {
        toast.success("Templates imported successfully");
      } else {
        toast.error("Invalid template file");
      }
    },
    [editor]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const filteredVariables = useMemo(() => {
    if (editor.editingGlobal) return editor.allVariables;
    return editor.allVariables.filter((v) =>
      v.availableFor.includes(editor.selectedType)
    );
  }, [editor.editingGlobal, editor.allVariables, editor.selectedType]);

  const shortcuts = useMemo(
    () => ({
      "mod+shift+c": handleCopy,
      "mod+shift+e": handleExport,
      "mod+b": toggleSidebar,
      "mod+shift+d": () => {
        editor.setDevice(editor.device === "desktop" ? "mobile" : "desktop");
      },
      "mod+1": () => SUPABASE_TEMPLATE_TYPES[0] && editor.changeType(SUPABASE_TEMPLATE_TYPES[0] as TemplateType),
      "mod+2": () => SUPABASE_TEMPLATE_TYPES[1] && editor.changeType(SUPABASE_TEMPLATE_TYPES[1] as TemplateType),
      "mod+3": () => SUPABASE_TEMPLATE_TYPES[2] && editor.changeType(SUPABASE_TEMPLATE_TYPES[2] as TemplateType),
      "mod+4": () => SUPABASE_TEMPLATE_TYPES[3] && editor.changeType(SUPABASE_TEMPLATE_TYPES[3] as TemplateType),
      "mod+5": () => SUPABASE_TEMPLATE_TYPES[4] && editor.changeType(SUPABASE_TEMPLATE_TYPES[4] as TemplateType),
      "mod+6": () => SUPABASE_TEMPLATE_TYPES[5] && editor.changeType(SUPABASE_TEMPLATE_TYPES[5] as TemplateType),
    }),
    [handleCopy, handleExport, toggleSidebar, editor]
  );

  useKeyboardShortcuts(shortcuts);

  // Loading state
  if (auth.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Auth gate
  if (!auth.isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <AuthDialog onSignIn={auth.signIn} onSignUp={auth.signUp} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader
        selectedType={editor.selectedType}
        editingGlobal={editor.editingGlobal}
        onTypeChange={editor.changeType}
        onExport={handleExport}
        onCopy={handleCopy}
        activeVariantName={editor.activeVariant.name}
        allTemplateTypes={editor.allTemplateTypes}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        user={auth.user}
        onSignOut={auth.signOut}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className={`shrink-0 transition-[width] duration-200 ${sidebarCollapsed ? "w-12" : "w-80 max-w-80"}`}>
          <TemplateSidebar
            selectedType={editor.selectedType}
            editingGlobal={editor.editingGlobal}
            onTypeChange={editor.changeType}
            onEditGlobal={editor.editGlobal}
            variantCounts={editor.variantCounts}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            allTemplateTypes={editor.allTemplateTypes}
            allVariables={editor.allVariables}
            onAddCustomTemplate={() => setShowCreateDialog(true)}
            onDeleteCustomTemplate={(id) => {
              editor.deleteCustomTemplateType(id);
              toast.success("Template deleted");
            }}
          />
        </div>
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel defaultSize="40" minSize="20">
            <PreviewCanvas
              html={
                editor.editingGlobal
                  ? applyStyleTokens(editor.globalTemplate.html, editor.templateStyle)
                  : editor.composedHtml
              }
              device={editor.device}
              onDeviceChange={editor.setDevice}
              zoom={editor.zoom}
              onZoomIn={editor.zoomIn}
              onZoomOut={editor.zoomOut}
              onZoomReset={editor.zoomReset}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="60" minSize="20">
            <EditorPanel
              selectedType={editor.selectedType}
              editingGlobal={editor.editingGlobal}
              subject={editor.currentTemplate.subject}
              html={
                editor.editingGlobal
                  ? editor.globalTemplate.html
                  : editor.currentTemplate.bodyHtml
              }
              onSubjectChange={editor.setSubject}
              onHtmlChange={
                editor.editingGlobal ? editor.setGlobalHtml : editor.setBodyHtml
              }
              variants={editor.currentTemplate.variants}
              activeVariantId={editor.activeVariantId}
              onVariantSelect={editor.selectVariant}
              onVariantCreate={handleVariantCreate}
              onVariantDuplicate={handleVariantDuplicate}
              onVariantDelete={editor.deleteVariant}
              onVariantRename={editor.renameVariant}
              filteredVariables={filteredVariables}
              templateStyle={editor.templateStyle}
              onStyleChange={editor.updateStyle}
              editorRef={editorRef}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <CreateCustomTemplateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={(info, variables) => {
          editor.addCustomTemplateType(info, variables);
          toast.success(`Created "${info.label}" template`);
        }}
      />
    </div>
  );
}
