"use client";

import { AppHeader } from "@/components/layout/app-header";
import { TemplateSidebar } from "@/components/layout/template-sidebar";
import { PreviewCanvas } from "@/components/layout/preview-canvas";
import { EditorPanel } from "@/components/layout/editor-panel";
import { useTemplateEditor } from "@/hooks/use-template-editor";

export default function Home() {
  const editor = useTemplateEditor();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader
        selectedType={editor.selectedType}
        onTypeChange={editor.changeType}
        onExport={editor.exportHtml}
        onCopy={editor.copyHtml}
      />

      <div className="flex flex-1 overflow-hidden">
        <TemplateSidebar
          selectedType={editor.selectedType}
          onTypeChange={editor.changeType}
          variantCounts={editor.variantCounts}
        />

        <PreviewCanvas
          html={editor.currentTemplate.html}
          device={editor.device}
          onDeviceChange={editor.setDevice}
        />

        <EditorPanel
          selectedType={editor.selectedType}
          subject={editor.currentTemplate.subject}
          html={editor.currentTemplate.html}
          onSubjectChange={editor.setSubject}
          onHtmlChange={editor.setHtml}
          variants={editor.currentTemplate.variants}
          activeVariantId={editor.activeVariantId}
          onVariantSelect={editor.selectVariant}
          onVariantCreate={editor.createVariant}
          onVariantDuplicate={editor.duplicateVariant}
          onVariantDelete={editor.deleteVariant}
        />
      </div>
    </div>
  );
}
