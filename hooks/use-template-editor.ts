"use client";

import { useState, useCallback, useMemo } from "react";
import type { TemplateType, TemplateVariant } from "@/lib/types";
import { emailTemplates } from "@/lib/mock-data";

export function useTemplateEditor() {
  const [selectedType, setSelectedType] = useState<TemplateType>("confirm-signup");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

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

  const variantCounts = useMemo(() => {
    const counts: Partial<Record<TemplateType, number>> = {};
    for (const t of templates) {
      counts[t.type] = t.variants.length;
    }
    return counts as Record<TemplateType, number>;
  }, [templates]);

  const setHtml = useCallback(
    (html: string) => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.type !== selectedType) return t;
          return {
            ...t,
            html,
            variants: t.variants.map((v) =>
              v.id === activeVariantId ? { ...v, html } : v
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
            return { ...t, html: variant.html, subject: variant.subject };
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
      html: activeVariant.html,
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
        html: source.html,
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
          return { ...t, variants: remaining, html: remaining[0].html, subject: remaining[0].subject };
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
    },
    []
  );

  const copyHtml = useCallback(() => {
    navigator.clipboard.writeText(currentTemplate.html);
  }, [currentTemplate]);

  const exportHtml = useCallback(() => {
    const blob = new Blob([currentTemplate.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedType}-template.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentTemplate, selectedType]);

  return {
    selectedType,
    device,
    setDevice,
    currentTemplate,
    activeVariant,
    activeVariantId,
    variantCounts,
    changeType,
    setHtml,
    setSubject,
    selectVariant,
    createVariant,
    duplicateVariant,
    deleteVariant,
    copyHtml,
    exportHtml,
  };
}
