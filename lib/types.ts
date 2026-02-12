export type SupabaseTemplateType =
  | "confirm-signup"
  | "invite-user"
  | "magic-link"
  | "change-email"
  | "reset-password"
  | "reauthentication";

export type CustomTemplateType = `custom-${string}`;

export type TemplateType = SupabaseTemplateType | CustomTemplateType;

export type TemplateCategory = "supabase-auth" | "custom";

export const SUPABASE_TEMPLATE_TYPES: SupabaseTemplateType[] = [
  "confirm-signup",
  "invite-user",
  "magic-link",
  "change-email",
  "reset-password",
  "reauthentication",
];

export function isCustomTemplate(id: string): id is CustomTemplateType {
  return id.startsWith("custom-");
}

export const BODY_PLACEHOLDER = "<!-- BODY_CONTENT -->";

export interface GlobalTemplate {
  html: string; // Full HTML doc with <!-- BODY_CONTENT --> placeholder
}

export interface TemplateTypeInfo {
  id: TemplateType;
  label: string;
  description: string;
  icon: string;
  variables: string[];
  category: TemplateCategory;
  isBuiltIn: boolean;
}

export interface TemplateVariable {
  name: string;
  syntax: string;
  description: string;
  availableFor: TemplateType[];
}

/** @deprecated Use TemplateVariable instead */
export type SupabaseVariable = TemplateVariable;

export interface TemplateVariant {
  id: string;
  name: string;
  bodyHtml: string;
  subject: string;
}

export interface EmailTemplate {
  type: TemplateType;
  subject: string;
  bodyHtml: string;
  variants: TemplateVariant[];
}

export interface TemplateStyle {
  brandName: string;
  brandColor: string;
  backgroundColor: string;
  containerBackground: string;
  headingColor: string;
  bodyColor: string;
  footerColor: string;
  footerLinkColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  buttonRadius: string;
  containerRadius: string;
  fontFamily: string;
  headingSize: string;
  bodySize: string;
}

export const DEFAULT_STYLE: TemplateStyle = {
  brandName: "YourApp",
  brandColor: "#18181b",
  backgroundColor: "#f4f4f5",
  containerBackground: "#ffffff",
  headingColor: "#18181b",
  bodyColor: "#52525b",
  footerColor: "#a1a1aa",
  footerLinkColor: "#71717a",
  buttonBackground: "#18181b",
  buttonTextColor: "#ffffff",
  buttonRadius: "8px",
  containerRadius: "12px",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  headingSize: "24px",
  bodySize: "15px",
};
