"use client";

import { useState, useCallback, useMemo } from "react";
import type { TemplateType, TemplateVariant, GlobalTemplate, TemplateStyle } from "@/lib/types";
import { DEFAULT_STYLE } from "@/lib/types";
import { emailTemplates, defaultGlobalTemplate } from "@/lib/mock-data";
import { composeEmail, applyStyleTokens } from "@/lib/utils";

export function useTemplateEditor() {
  const [selectedType, setSelectedType] = useState<TemplateType>("confirm-signup");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [editingGlobal, setEditingGlobal] = useState(false);
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>(() => ({ ...DEFAULT_STYLE }));

  const [globalTemplate, setGlobalTemplate] = useState<GlobalTemplate>(
    () => ({ ...defaultGlobalTemplate })
  );

  // Deep clone templates so we can mutate independently
  const [templates, setTemplates] = useState(() =>
    emailTemplates.map((t) => ({
      ...t,
      variants: t.variants.map((v) => ({ ...v })),
    }))
  );

  const [activeVariantIds, setActiveVariantIds] = useState<Record<TemplateType, string>>(
    () => {
      const ids: Partial<Record<TemplateType, string>> = {};
      for (const t of emailTemplates) {
        ids[t.type] = t.variants[0]?.id ?? "default";
      }
      return ids as Record<TemplateType, string>;
    }
  );

  const currentTemplate = useMemo(
    () => templates.find((t) => t.type === selectedType)!,
    [templates, selectedType]
  );

  const activeVariantId = activeVariantIds[selectedType];

  const activeVariant = useMemo(
    () =>
      currentTemplate.variants.find((v) => v.id === activeVariantId) ??
      currentTemplate.variants[0],
    [currentTemplate, activeVariantId]
  );

  const composedHtml = useMemo(
    () => composeEmail(globalTemplate.html, currentTemplate.bodyHtml, templateStyle),
    [globalTemplate.html, currentTemplate.bodyHtml, templateStyle]
  );

  const variantCounts = useMemo(() => {
    const counts: Partial<Record<TemplateType, number>> = {};
    for (const t of templates) {
      counts[t.type] = t.variants.length;
    }
    return counts as Record<TemplateType, number>;
  }, [templates]);

  const setGlobalHtml = useCallback((html: string) => {
    setGlobalTemplate((prev) => ({ ...prev, html }));
  }, []);

  const setBodyHtml = useCallback(
    (bodyHtml: string) => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.type !== selectedType) return t;
          return {
            ...t,
            bodyHtml,
            variants: t.variants.map((v) =>
              v.id === activeVariantId ? { ...v, bodyHtml } : v
            ),
          };
        })
      );
    },
    [selectedType, activeVariantId]
  );

  const setSubject = useCallback(
    (subject: string) => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.type !== selectedType) return t;
          return {
            ...t,
            subject,
            variants: t.variants.map((v) =>
              v.id === activeVariantId ? { ...v, subject } : v
            ),
          };
        })
      );
    },
    [selectedType, activeVariantId]
  );

  const selectVariant = useCallback(
    (variantId: string) => {
      setActiveVariantIds((prev) => ({ ...prev, [selectedType]: variantId }));
      const variant = currentTemplate.variants.find((v) => v.id === variantId);
      if (variant) {
        setTemplates((prev) =>
          prev.map((t) => {
            if (t.type !== selectedType) return t;
            return { ...t, bodyHtml: variant.bodyHtml, subject: variant.subject };
          })
        );
      }
    },
    [selectedType, currentTemplate]
  );

  const createVariant = useCallback(() => {
    const id = `variant-${Date.now()}`;
    const newVariant: TemplateVariant = {
      id,
      name: `Variant ${currentTemplate.variants.length + 1}`,
      bodyHtml: activeVariant.bodyHtml,
      subject: activeVariant.subject,
    };
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.type !== selectedType) return t;
        return { ...t, variants: [...t.variants, newVariant] };
      })
    );
    setActiveVariantIds((prev) => ({ ...prev, [selectedType]: id }));
  }, [selectedType, currentTemplate, activeVariant]);

  const duplicateVariant = useCallback(
    (variantId: string) => {
      const source = currentTemplate.variants.find((v) => v.id === variantId);
      if (!source) return;
      const id = `variant-${Date.now()}`;
      const newVariant: TemplateVariant = {
        id,
        name: `${source.name} (Copy)`,
        bodyHtml: source.bodyHtml,
        subject: source.subject,
      };
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.type !== selectedType) return t;
          return { ...t, variants: [...t.variants, newVariant] };
        })
      );
      setActiveVariantIds((prev) => ({ ...prev, [selectedType]: id }));
    },
    [selectedType, currentTemplate]
  );

  const deleteVariant = useCallback(
    (variantId: string) => {
      const remaining = currentTemplate.variants.filter((v) => v.id !== variantId);
      if (remaining.length === 0) return;
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.type !== selectedType) return t;
          return { ...t, variants: remaining, bodyHtml: remaining[0].bodyHtml, subject: remaining[0].subject };
        })
      );
      if (activeVariantId === variantId) {
        setActiveVariantIds((prev) => ({
          ...prev,
          [selectedType]: remaining[0].id,
        }));
      }
    },
    [selectedType, currentTemplate, activeVariantId]
  );

  const changeType = useCallback(
    (type: TemplateType) => {
      setSelectedType(type);
      setEditingGlobal(false);
    },
    []
  );

  const editGlobal = useCallback(() => {
    setEditingGlobal(true);
  }, []);

  const updateStyle = useCallback((updates: Partial<TemplateStyle>) => {
    setTemplateStyle((prev) => ({ ...prev, ...updates }));
  }, []);

  const copyHtml = useCallback(() => {
    if (editingGlobal) {
      navigator.clipboard.writeText(applyStyleTokens(globalTemplate.html, templateStyle));
    } else {
      navigator.clipboard.writeText(composedHtml);
    }
  }, [editingGlobal, globalTemplate.html, composedHtml, templateStyle]);

  const exportHtml = useCallback(() => {
    const content = editingGlobal ? applyStyleTokens(globalTemplate.html, templateStyle) : composedHtml;
    const filename = editingGlobal ? "base-template.html" : `${selectedType}-template.html`;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [editingGlobal, globalTemplate.html, composedHtml, selectedType, templateStyle]);

  return {
    selectedType,
    device,
    setDevice,
    currentTemplate,
    activeVariant,
    activeVariantId,
    variantCounts,
    changeType,
    setBodyHtml,
    setSubject,
    selectVariant,
    createVariant,
    duplicateVariant,
    deleteVariant,
    copyHtml,
    exportHtml,
    // Global template additions
    editingGlobal,
    editGlobal,
    globalTemplate,
    setGlobalHtml,
    composedHtml,
    // Style customization
    templateStyle,
    updateStyle,
  };
}
