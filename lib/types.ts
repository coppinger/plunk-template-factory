export type TemplateType =
  | "confirm-signup"
  | "invite-user"
  | "magic-link"
  | "change-email"
  | "reset-password"
  | "reauthentication";

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
  html: string;
  subject: string;
}

export interface EmailTemplate {
  type: TemplateType;
  subject: string;
  html: string;
  variants: TemplateVariant[];
}
