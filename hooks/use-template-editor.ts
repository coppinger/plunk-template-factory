"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  TemplateType,
  TemplateVariant,
  GlobalTemplate,
  TemplateStyle,
  TemplateTypeInfo,
  TemplateVariable,
  EmailTemplate,
} from "@/lib/types";
import { DEFAULT_STYLE } from "@/lib/types";
import {
  emailTemplates,
  defaultGlobalTemplate,
  templateTypes,
  templateVariables,
  seedCustomTemplateTypes,
  seedCustomVariables,
  seedCustomEmailTemplates,
} from "@/lib/mock-data";
import { composeEmail, applyStyleTokens } from "@/lib/utils";

export function useTemplateEditor() {
  const [selectedType, setSelectedType] = useState<TemplateType>("confirm-signup");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [editingGlobal, setEditingGlobal] = useState(false);
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>(() => ({ ...DEFAULT_STYLE }));
  const [zoom, setZoom] = useState(1);

  const [globalTemplate, setGlobalTemplate] = useState<GlobalTemplate>(
    () => ({ ...defaultGlobalTemplate })
  );

  // Custom template types and variables
  const [customTemplateTypes, setCustomTemplateTypes] = useState<TemplateTypeInfo[]>(
    () => [...seedCustomTemplateTypes]
  );
  const [customVariables, setCustomVariables] = useState<TemplateVariable[]>(
    () => [...seedCustomVariables]
  );

  // Deep clone templates so we can mutate independently
  const allInitialTemplates = [...emailTemplates, ...seedCustomEmailTemplates];
  const [templates, setTemplates] = useState(() =>
    allInitialTemplates.map((t) => ({
      ...t,
      variants: t.variants.map((v) => ({ ...v })),
    }))
  );

  const [activeVariantIds, setActiveVariantIds] = useState<Record<string, string>>(
    () => {
      const ids: Record<string, string> = {};
      for (const t of allInitialTemplates) {
        ids[t.type] = t.variants[0]?.id ?? "default";
      }
      return ids;
    }
  );

  // Merged template types and variables
  const allTemplateTypes = useMemo(
    () => [...templateTypes, ...customTemplateTypes],
    [customTemplateTypes]
  );

  const allVariables = useMemo(
    () => [...templateVariables, ...customVariables],
    [customVariables]
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
    const counts: Record<string, number> = {};
    for (const t of templates) {
      counts[t.type] = t.variants.length;
    }
    return counts;
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

  const renameVariant = useCallback(
    (variantId: string, name: string) => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.type !== selectedType) return t;
          return {
            ...t,
            variants: t.variants.map((v) =>
              v.id === variantId ? { ...v, name } : v
            ),
          };
        })
      );
    },
    [selectedType]
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

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(2, Math.round((prev + 0.1) * 10) / 10));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(0.3, Math.round((prev - 0.1) * 10) / 10));
  }, []);

  const zoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  // Custom template CRUD
  const addCustomTemplateType = useCallback(
    (info: TemplateTypeInfo, variables: TemplateVariable[]) => {
      setCustomTemplateTypes((prev) => [...prev, info]);
      setCustomVariables((prev) => [...prev, ...variables]);

      const defaultBody = `<h1 style="margin: 0 0 8px; font-size: {{STYLE_HEADING_SIZE}}; font-weight: 700; color: {{STYLE_HEADING_COLOR}}; letter-spacing: -0.02em;">
                ${info.label}
              </h1>
              <p style="margin: 0 0 24px; font-size: {{STYLE_BODY_SIZE}}; line-height: 24px; color: {{STYLE_BODY_COLOR}};">
                ${info.description}
              </p>`;

      const newTemplate: EmailTemplate = {
        type: info.id,
        subject: info.label,
        bodyHtml: defaultBody,
        variants: [
          {
            id: "default",
            name: "Default",
            subject: info.label,
            bodyHtml: defaultBody,
          },
        ],
      };

      setTemplates((prev) => [...prev, { ...newTemplate, variants: [...newTemplate.variants] }]);
      setActiveVariantIds((prev) => ({ ...prev, [info.id]: "default" }));
      setSelectedType(info.id);
      setEditingGlobal(false);
    },
    []
  );

  const deleteCustomTemplateType = useCallback(
    (id: TemplateType) => {
      setCustomTemplateTypes((prev) => prev.filter((t) => t.id !== id));
      setCustomVariables((prev) => prev.filter((v) => !v.availableFor.includes(id)));
      setTemplates((prev) => prev.filter((t) => t.type !== id));
      setActiveVariantIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (selectedType === id) {
        setSelectedType("confirm-signup");
        setEditingGlobal(false);
      }
    },
    [selectedType]
  );

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
    renameVariant,
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
    // Zoom
    zoom,
    zoomIn,
    zoomOut,
    zoomReset,
    // Custom template support
    allTemplateTypes,
    allVariables,
    addCustomTemplateType,
    deleteCustomTemplateType,
  };
}
