"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
import type { PersistedData } from "@/lib/persistence";
import { isValidPersistedData } from "@/lib/persistence";
import {
  emailTemplates,
  defaultGlobalTemplate,
  templateTypes,
  templateVariables,
  seedCustomTemplateTypes,
  seedCustomVariables,
  seedCustomEmailTemplates,
} from "@/lib/mock-data";
import { composeEmail, applyStyleTokens, dedent } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

function buildInitialTemplates() {
  const all = [...emailTemplates, ...seedCustomEmailTemplates];
  return all.map((t) => ({
    ...t,
    variants: t.variants.map((v) => ({ ...v })),
  }));
}

function buildInitialVariantIds() {
  const all = [...emailTemplates, ...seedCustomEmailTemplates];
  const ids: Record<string, string> = {};
  for (const t of all) {
    ids[t.type] = t.variants[0]?.id ?? "default";
  }
  return ids;
}

export function useTemplateEditor(authState: AuthState, projectId: string | null) {
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
  const isLoaded = loadedProjectId === projectId && projectId !== null;
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
  const [templates, setTemplates] = useState(() => buildInitialTemplates());

  const [activeVariantIds, setActiveVariantIds] = useState<Record<string, string>>(
    () => buildInitialVariantIds()
  );

  // Shared helpers for load/import and save/export
  const applyPersistedData = useCallback((d: PersistedData) => {
    setTemplates(d.templates);
    setGlobalTemplate(d.globalTemplate);
    setTemplateStyle(d.templateStyle);
    setCustomTemplateTypes(d.customTemplateTypes);
    setCustomVariables(d.customVariables);
    setActiveVariantIds(d.activeVariantIds);
  }, []);

  const resetToDefaults = useCallback(() => {
    setTemplates(buildInitialTemplates());
    setGlobalTemplate({ ...defaultGlobalTemplate });
    setTemplateStyle({ ...DEFAULT_STYLE });
    setCustomTemplateTypes([...seedCustomTemplateTypes]);
    setCustomVariables([...seedCustomVariables]);
    setActiveVariantIds(buildInitialVariantIds());
    setSelectedType("confirm-signup");
    setEditingGlobal(false);
  }, []);

  const getPersistedData = useCallback((): PersistedData => {
    return {
      version: 1,
      lastModified: new Date().toISOString(),
      templates,
      globalTemplate,
      templateStyle,
      customTemplateTypes,
      customVariables,
      activeVariantIds,
    };
  }, [templates, globalTemplate, templateStyle, customTemplateTypes, customVariables, activeVariantIds]);

  // Load persisted data when projectId changes
  useEffect(() => {
    if (authState.loading || !authState.isAuthenticated) return;
    if (!projectId) return;

    // Capture the projectId at fetch time to avoid stale closures
    const fetchProjectId = projectId;
    let cancelled = false;

    fetch(`/api/templates?projectId=${fetchProjectId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((result) => {
        if (cancelled) return;
        if (result.saved) {
          applyPersistedData(result.data as PersistedData);
        } else {
          resetToDefaults();
        }
        setLoadedProjectId(fetchProjectId);
      })
      .catch((err) => {
        console.error("Failed to load templates:", err);
        if (!cancelled) {
          resetToDefaults();
          setLoadedProjectId(fetchProjectId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authState.loading, authState.isAuthenticated, projectId, applyPersistedData, resetToDefaults]);

  // Debounced auto-save — skip saving immediately after loading
  const skipNextSave = useRef(false);
  useEffect(() => {
    // Mark to skip the first auto-save after loading a project
    skipNextSave.current = true;
  }, [loadedProjectId]);

  useEffect(() => {
    if (!isLoaded || !authState.isAuthenticated || !projectId) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/templates?projectId=${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getPersistedData()),
      }).catch((err) => console.error("Failed to save templates:", err));
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLoaded, authState.isAuthenticated, projectId, getPersistedData]);

  // JSON export/import
  const exportJson = useCallback(() => {
    const data = getPersistedData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().split("T")[0];
    a.download = `plunk-templates-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getPersistedData]);

  const importJson = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!isValidPersistedData(data)) {
          return false;
        }
        applyPersistedData(data);
        return true;
      } catch {
        return false;
      }
    },
    [applyPersistedData]
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

      const defaultBody = dedent(`<h1 style="margin: 0 0 8px; font-size: {{STYLE_HEADING_SIZE}}; font-weight: 700; color: {{STYLE_HEADING_COLOR}}; letter-spacing: -0.02em;">
                ${info.label}
              </h1>
              <p style="margin: 0 0 24px; font-size: {{STYLE_BODY_SIZE}}; line-height: 24px; color: {{STYLE_BODY_COLOR}};">
                ${info.description}
              </p>`);

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
    isLoaded,
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
    // JSON export/import
    exportJson,
    importJson,
  };
}
