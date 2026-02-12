"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { TemplateSidebar } from "@/components/layout/template-sidebar";
import { PreviewCanvas } from "@/components/layout/preview-canvas";
import { EditorPanel } from "@/components/layout/editor-panel";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { applyStyleTokens } from "@/lib/utils";
import { templateTypes } from "@/lib/mock-data";
import type { TemplateType } from "@/lib/types";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { toast } from "sonner";

export default function Home() {
  const editor = useTemplateEditor();
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const shortcuts = useMemo(
    () => ({
      "mod+shift+c": handleCopy,
      "mod+shift+e": handleExport,
      "mod+b": toggleSidebar,
      "mod+shift+d": () => {
        editor.setDevice(editor.device === "desktop" ? "mobile" : "desktop");
      },
      "mod+1": () => templateTypes[0] && editor.changeType(templateTypes[0].id as TemplateType),
      "mod+2": () => templateTypes[1] && editor.changeType(templateTypes[1].id as TemplateType),
      "mod+3": () => templateTypes[2] && editor.changeType(templateTypes[2].id as TemplateType),
      "mod+4": () => templateTypes[3] && editor.changeType(templateTypes[3].id as TemplateType),
      "mod+5": () => templateTypes[4] && editor.changeType(templateTypes[4].id as TemplateType),
      "mod+6": () => templateTypes[5] && editor.changeType(templateTypes[5].id as TemplateType),
    }),
    [handleCopy, handleExport, toggleSidebar, editor]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader
        selectedType={editor.selectedType}
        editingGlobal={editor.editingGlobal}
        onTypeChange={editor.changeType}
        onExport={handleExport}
        onCopy={handleCopy}
        activeVariantName={editor.activeVariant.name}
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
              templateStyle={editor.templateStyle}
              onStyleChange={editor.updateStyle}
              editorRef={editorRef}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
