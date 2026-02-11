# Plunk Template Factory

Visual editor for Supabase Auth email templates. Single-page Next.js app with a three-panel layout: template sidebar, live preview, and code editor.

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, tw-animate-css
- **UI components**: ShadCN (new-york style, Radix UI primitives, Lucide icons)
- **Code editor**: CodeMirror 6 via @uiw/react-codemirror with HTML language support
- **Fonts**: DM Sans (body), DM Mono (code) via next/font/google

## Project Structure

```
app/
  layout.tsx          # Root layout with DM Sans/Mono fonts, TooltipProvider wrapper
  page.tsx            # Main page - composes three-panel layout, wires useTemplateEditor
  globals.css         # Tailwind + ShadCN CSS variables (neutral base color)

components/
  layout/
    app-header.tsx        # Top bar: logo, template type selector, copy/export buttons
    template-sidebar.tsx  # Left panel (280px): template type list + variable quick-copy
    preview-canvas.tsx    # Center panel: iframe preview with desktop/mobile toggle
    editor-panel.tsx      # Right panel (420px): tabbed Edit/Variables/Variants panes
  editor/
    code-editor.tsx       # CodeMirror wrapper for HTML editing
  ui/                     # ShadCN components (badge, button, card, dialog, etc.)

hooks/
  use-template-editor.ts  # Core state hook: template selection, variant CRUD, HTML/subject editing, copy/export

lib/
  types.ts      # TemplateType union, EmailTemplate, TemplateVariant, SupabaseVariable interfaces
  mock-data.ts  # 6 template types with HTML content, Supabase template variables
  utils.ts      # cn() helper (clsx + tailwind-merge)
```

## Architecture

- **Client-only app**: `page.tsx` is `"use client"`. No server actions, no database, no API routes.
- **State management**: All editor state lives in `useTemplateEditor` hook. No external state libraries.
- **Template data**: Currently uses mock data in `lib/mock-data.ts`. No backend persistence.
- **Live preview**: Renders HTML in a sandboxed iframe (`allow-same-origin`).
- **Path aliases**: `@/*` maps to project root.

## Template Types

Six Supabase auth email templates: `confirm-signup`, `invite-user`, `magic-link`, `change-email`, `reset-password`, `reauthentication`. Defined as the `TemplateType` union in `lib/types.ts`.

## Supabase Variables

Templates use Go template syntax: `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .TokenHash }}`, `{{ .SiteURL }}`, `{{ .Email }}`, `{{ .NewEmail }}`, `{{ .RedirectTo }}`. Each variable has an `availableFor` list mapping it to applicable template types.

## Variant System

Each template type supports multiple variants (e.g., Default, Minimal, Branded for confirm-signup). Variants store independent `html` and `subject` values. Users can create, duplicate, and delete variants. Active variant is tracked per template type.

## ShadCN Config

`components.json` uses new-york style, neutral base color, CSS variables enabled, Lucide icons. Components installed to `components/ui/`.
