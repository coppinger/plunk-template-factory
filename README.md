# Plunk Template Factory

A visual editor for crafting Supabase Auth email templates. Design, preview, and export production-ready HTML emails without writing code from scratch.

## Features

- **Six Supabase Auth templates** — Confirm signup, invite user, magic link, change email, reset password, and reauthentication
- **Live preview** — See your changes instantly in a sandboxed iframe with desktop/mobile toggle
- **Code editor** — Full HTML editing powered by CodeMirror with syntax highlighting
- **Global layout** — Edit a shared HTML wrapper once, apply it across all templates
- **Style tokens** — Customize brand colors, fonts, button styles, and spacing from a visual panel
- **Variant system** — Create, duplicate, and manage multiple design variants per template
- **Supabase variables** — Quick-copy Go template variables (`{{ .ConfirmationURL }}`, `{{ .Token }}`, etc.) with per-template availability hints
- **Export** — Copy to clipboard or download the composed HTML, ready to paste into your Supabase dashboard

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
  layout.tsx          # Root layout with fonts and providers
  page.tsx            # Main page — three-panel editor layout
  globals.css         # Tailwind + ShadCN CSS variables

components/
  layout/
    app-header.tsx        # Top bar: template selector, copy/export actions
    template-sidebar.tsx  # Left panel: template list + variable reference
    preview-canvas.tsx    # Center panel: live iframe preview
    editor-panel.tsx      # Right panel: code editor, variants, style controls
  editor/
    code-editor.tsx       # CodeMirror wrapper
  ui/                     # ShadCN components

hooks/
  use-template-editor.ts  # All editor state: templates, variants, styles

lib/
  types.ts      # TypeScript types and default style config
  mock-data.ts  # Template content and Supabase variable definitions
  utils.ts      # Utilities (cn helper, style token application)
```

## How It Works

The app is entirely client-side — no backend, no database, no API routes. All state lives in a single `useTemplateEditor` hook. Templates are composed by injecting body content into a global HTML layout, with style tokens replaced at render time. The result is a self-contained HTML email you can paste directly into your Supabase Auth email template settings.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is free and open source.
