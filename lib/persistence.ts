import type {
  EmailTemplate,
  GlobalTemplate,
  TemplateStyle,
  TemplateTypeInfo,
  TemplateVariable,
} from "./types";

export interface PersistedData {
  version: 1;
  lastModified: string;
  templates: EmailTemplate[];
  globalTemplate: GlobalTemplate;
  templateStyle: TemplateStyle;
  customTemplateTypes: TemplateTypeInfo[];
  customVariables: TemplateVariable[];
  activeVariantIds: Record<string, string>;
}

export function isValidPersistedData(data: unknown): data is PersistedData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 1 &&
    typeof d.lastModified === "string" &&
    Array.isArray(d.templates) &&
    typeof d.globalTemplate === "object" &&
    d.globalTemplate !== null &&
    typeof d.templateStyle === "object" &&
    d.templateStyle !== null &&
    Array.isArray(d.customTemplateTypes) &&
    Array.isArray(d.customVariables) &&
    typeof d.activeVariantIds === "object" &&
    d.activeVariantIds !== null
  );
}
