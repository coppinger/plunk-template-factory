export async function formatHtml(html: string): Promise<string> {
  const prettier = await import("prettier/standalone");
  const htmlPlugin = await import("prettier/plugins/html");

  return prettier.format(html, {
    parser: "html",
    plugins: [htmlPlugin.default ?? htmlPlugin],
    printWidth: 120,
    tabWidth: 2,
    htmlWhitespaceSensitivity: "ignore",
  });
}
