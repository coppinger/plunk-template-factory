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

export interface Project {
  id: string;
  name: string;
  data: PersistedData;
}

export interface ProjectListItem {
  id: string;
  name: string;
  updatedAt: string;
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

export function isValidProject(data: unknown): data is Project {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    isValidPersistedData(d.data)
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_RE.test(value);
}

export const MAX_PROJECT_NAME_LENGTH = 100;
export const MAX_PROJECTS_PER_USER = 50;
