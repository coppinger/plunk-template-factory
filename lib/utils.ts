import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BODY_PLACEHOLDER, type TemplateStyle } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strip common leading whitespace from a template literal string.
 * Ignores the first line (which is typically empty after the backtick)
 * and blank lines when computing the indent.
 */
export function dedent(str: string): string {
  const lines = str.split("\n");
  // Skip the first line and blank lines when computing minimum indent
  const indents = lines
    .filter((line, i) => i > 0 && line.trim().length > 0)
    .map((line) => line.match(/^(\s*)/)?.[1].length ?? 0);
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0;
  if (minIndent === 0) return str;
  return lines
    .map((line, i) => (i === 0 ? line : line.slice(minIndent)))
    .join("\n");
}

export function applyStyleTokens(html: string, style: TemplateStyle): string {
  const tokenMap: Record<string, string> = {
    "{{STYLE_BRAND_NAME}}": style.brandName,
    "{{STYLE_BRAND_COLOR}}": style.brandColor,
    "{{STYLE_BG_COLOR}}": style.backgroundColor,
    "{{STYLE_CONTAINER_BG}}": style.containerBackground,
    "{{STYLE_CONTAINER_RADIUS}}": style.containerRadius,
    "{{STYLE_HEADING_COLOR}}": style.headingColor,
    "{{STYLE_HEADING_SIZE}}": style.headingSize,
    "{{STYLE_BODY_COLOR}}": style.bodyColor,
    "{{STYLE_BODY_SIZE}}": style.bodySize,
    "{{STYLE_BUTTON_BG}}": style.buttonBackground,
    "{{STYLE_BUTTON_TEXT}}": style.buttonTextColor,
    "{{STYLE_BUTTON_RADIUS}}": style.buttonRadius,
    "{{STYLE_FOOTER_COLOR}}": style.footerColor,
    "{{STYLE_FOOTER_LINK_COLOR}}": style.footerLinkColor,
    "{{STYLE_FONT_FAMILY}}": style.fontFamily,
  };

  let result = html;
  for (const [token, value] of Object.entries(tokenMap)) {
    result = result.replaceAll(token, value);
  }
  return result;
}

export function composeEmail(globalHtml: string, bodyHtml: string, style?: TemplateStyle): string {
  let global = globalHtml;
  let body = bodyHtml;
  if (style) {
    global = applyStyleTokens(global, style);
    body = applyStyleTokens(body, style);
  }
  if (!global.includes(BODY_PLACEHOLDER)) return global + body;
  return global.replace(BODY_PLACEHOLDER, body);
}
