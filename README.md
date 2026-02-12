# Plunk Template Factory

A visual editor for Supabase Auth email templates and custom email templates. Design, preview, and export production-ready HTML emails without writing code from scratch.

## Features

- **Supabase Auth templates** — All six built-in types: confirm signup, invite user, magic link, change email, reset password, and reauthentication
- **Custom templates** — Create your own template types with custom names, descriptions, icons, and variables
- **Live preview** — See changes instantly in a sandboxed iframe with desktop/mobile toggle
- **Code editor** — Full HTML editing powered by CodeMirror with syntax highlighting
- **Global layout** — Edit a shared HTML wrapper once, apply it across all templates
- **Style tokens** — Customize brand colors, fonts, button styles, and spacing from a visual panel
- **Variant system** — Create, duplicate, and manage multiple design variants per template
- **Template variables** — Quick-copy Go template variables for Supabase (`{{ .ConfirmationURL }}`) or custom `{{variableName}}` syntax, with per-template availability hints
- **Auto-save** — Editor state persists to a local JSON file automatically with 1-second debounce
- **Export** — Copy to clipboard or download the composed HTML, ready to paste into your Supabase dashboard
- **Dark mode** — Full dark mode support
- **Collapsible sidebar** — Fixed sidebar (320px) that collapses to 48px for more editing space

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start editing templates.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com) (Radix primitives + Lucide icons)
- [CodeMirror 6](https://codemirror.net) via `@uiw/react-codemirror`

## Project Structure

```
app/
  layout.tsx          # Root layout with DM Sans/Mono fonts, TooltipProvider
  page.tsx            # Main page — fixed sidebar + resizable preview/editor panels
  globals.css         # Tailwind + ShadCN CSS variables
  api/templates/
    route.ts          # GET/POST API: reads/writes data/templates.json for persistence

components/
  layout/
    app-header.tsx                     # Top bar: logo, template type selector, copy/export
    template-sidebar.tsx               # Fixed sidebar: templates grouped by category, variable quick-copy
    preview-canvas.tsx                 # Center panel: live iframe preview with device toggle
    editor-panel.tsx                   # Right panel: tabbed Edit/Variables/Variants panes
    create-custom-template-dialog.tsx  # Dialog for creating custom template types
    delete-variant-dialog.tsx          # Confirmation dialog for variant deletion
  editor/
    code-editor.tsx   # CodeMirror wrapper for HTML editing
  ui/                 # ShadCN components

hooks/
  use-template-editor.ts  # Core state: template selection, variant CRUD, persistence

lib/
  types.ts         # Template type definitions, categories, variable interfaces
  persistence.ts   # PersistedData schema and validation
  mock-data.ts     # Seed template content, variables, and custom template definitions
  format-html.ts   # HTML formatting utilities
  utils.ts         # cn() helper, dedent(), composeEmail(), applyStyleTokens()
```

## How It Works

The UI is entirely client-side — all editor state lives in a single `useTemplateEditor` hook. Templates are composed by injecting body content into a global HTML layout, with style tokens replaced at render time. The result is a self-contained HTML email you can paste directly into your Supabase Auth email template settings or use for custom email flows.

State is persisted to a local JSON file (`data/templates.json`, gitignored) via a Next.js API route. On first load, the editor falls back to seed data from `lib/mock-data.ts`. Changes auto-save with a 1-second debounce.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is free and open source.
