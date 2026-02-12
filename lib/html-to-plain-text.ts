import type { HtmlToTextOptions } from "html-to-text";

let convertMod: typeof import("html-to-text") | null = null;

const options: HtmlToTextOptions = {
  wordwrap: 78,
  selectors: [
    { selector: "a", options: { linkBrackets: ["[", "]"] } },
    { selector: "img", format: "skip" },
    { selector: "table", options: { uppercaseHeaderCells: false } },
    {
      selector: 'table[role="presentation"]',
      format: "dataTable",
      options: { uppercaseHeaderCells: false },
    },
  ],
};

export async function htmlToPlainText(html: string): Promise<string> {
  if (!convertMod) {
    convertMod = await import("html-to-text");
  }
  return convertMod.convert(html, options);
}
