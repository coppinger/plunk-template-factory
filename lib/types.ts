export type TemplateType =
  | "confirm-signup"
  | "invite-user"
  | "magic-link"
  | "change-email"
  | "reset-password"
  | "reauthentication";

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
}

export interface SupabaseVariable {
  name: string;
  syntax: string;
  description: string;
  availableFor: TemplateType[];
}

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
