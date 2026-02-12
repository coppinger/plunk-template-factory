# Plunk Template Factory

Visual editor for Supabase Auth email templates and custom email templates. Single-page Next.js app with a fixed sidebar + two-panel resizable layout: template sidebar, live preview, and code editor.

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, tw-animate-css
- **UI components**: ShadCN (new-york style, Radix UI primitives, Lucide icons)
- **Code editor**: CodeMirror 6 via @uiw/react-codemirror with HTML language support
- **HTML formatting**: Prettier (standalone, lazy-loaded) for in-editor HTML formatting
- **Resizable panels**: react-resizable-panels for preview/editor split
- **Dark mode**: next-themes (dark mode only, no light toggle)
- **Toasts**: Sonner
- **Fonts**: DM Sans (body), DM Mono (code) via next/font/google

## Project Structure

```
app/
  layout.tsx          # Root layout with DM Sans/Mono fonts, TooltipProvider wrapper
  page.tsx            # Main page - fixed sidebar + resizable preview/editor, wires useTemplateEditor
  globals.css         # Tailwind + ShadCN CSS variables (neutral base color)
  api/templates/
    route.ts          # GET/POST API route: reads/writes data/templates.json (atomic writes via temp+rename)

components/
  layout/
    app-header.tsx        # Top bar: logo, grouped template type selector (by category), copy/export buttons
    template-sidebar.tsx  # Fixed left sidebar (320px, collapsible to 48px): templates grouped by category, variable quick-copy, new/delete custom template buttons
    preview-canvas.tsx    # Center resizable panel (40% default): iframe preview with desktop/mobile toggle
    editor-panel.tsx      # Right resizable panel (60% default): global view has Edit/Style/Variables tabs, per-template view has Edit/Variables/Variants tabs
    create-custom-template-dialog.tsx  # Dialog for creating custom template types with name, description, icon, and variable rows
    delete-variant-dialog.tsx          # Confirmation dialog for variant deletion
  editor/
    code-editor.tsx       # CodeMirror wrapper for HTML editing
    editor-toolbar.tsx    # Toolbar: format HTML (Prettier), wrap selection in tag, insert variable
    style-editor-tab.tsx  # Global style editor: brand, colors, buttons, typography, footer tokens
  ui/                     # ShadCN components (badge, button, card, dialog, etc.)

hooks/
  use-template-editor.ts    # Core state hook: template selection, variant CRUD, HTML/subject editing, copy/export, custom template CRUD, load/auto-save persistence
  use-keyboard-shortcuts.ts # Declarative keyboard shortcut hook (mod+key combos, respects input focus)

lib/
  types.ts         # SupabaseTemplateType, CustomTemplateType, TemplateType union, TemplateCategory, TemplateVariable, TemplateStyle, GlobalTemplate, BODY_PLACEHOLDER, DEFAULT_STYLE, isCustomTemplate()
  persistence.ts   # PersistedData interface (version, templates, globalTemplate, templateStyle, custom types/variables, activeVariantIds) + isValidPersistedData() type guard
  mock-data.ts     # 6 built-in Supabase template types, seed custom templates, templateVariables, seed custom variables
  format-html.ts   # Lazy-loads Prettier standalone to format HTML strings
  utils.ts         # cn() helper, dedent() for stripping template literal indentation, composeEmail() + applyStyleTokens()
```

## Architecture

- **Client-side UI**: `page.tsx` is `"use client"`. No server actions, no database.
- **State management**: All editor state lives in `useTemplateEditor` hook. No external state libraries.
- **Persistence**: Editor state is saved to a local JSON file (`data/templates.json`, gitignored) via `app/api/templates/route.ts`. On mount the hook fetches `GET /api/templates` and falls back to mock data if no file exists. State changes auto-save with a 1-second debounce via `POST /api/templates`. The `PersistedData` schema is versioned (`version: 1`) and validated by `isValidPersistedData()`. The hook exposes an `isLoaded` flag so the UI can wait for hydration.
- **Mock/seed data**: `lib/mock-data.ts` provides initial template content and variables used when no persisted file is present. Template body HTML strings are wrapped in `dedent()` to strip source-code indentation; new templates should follow this pattern.
- **Global template + body**: A `GlobalTemplate` holds the full HTML document shell with a `<!-- BODY_CONTENT -->` placeholder (`BODY_PLACEHOLDER`). Each variant stores only its `bodyHtml`. `composeEmail()` in `lib/utils.ts` merges the global shell and body, applying style tokens.
- **Style tokens**: Templates use `{{STYLE_*}}` tokens (e.g. `{{STYLE_BRAND_COLOR}}`, `{{STYLE_BUTTON_BG}}`). `applyStyleTokens()` replaces these with values from the `TemplateStyle` object. The `StyleEditorTab` component lets users edit these values; `DEFAULT_STYLE` provides defaults.
- **Live preview**: Renders composed HTML in a sandboxed iframe (`allow-same-origin`).
- **Path aliases**: `@/*` maps to project root.

## Template Types

Two categories of templates, distinguished by `TemplateCategory` (`"supabase-auth"` | `"custom"`):

- **Supabase Auth** (built-in): Six types defined as `SupabaseTemplateType` -- `confirm-signup`, `invite-user`, `magic-link`, `change-email`, `reset-password`, `reauthentication`. Listed in the `SUPABASE_TEMPLATE_TYPES` constant.
- **Custom**: User-created templates with `CustomTemplateType` (pattern: `custom-${string}`). Identified at runtime via `isCustomTemplate()` helper. Custom templates can be added and deleted; built-in templates cannot.

`TemplateType` is the union of both: `SupabaseTemplateType | CustomTemplateType`. Each `TemplateTypeInfo` has `category` and `isBuiltIn` fields.

## Template Variables

Supabase templates use Go template syntax: `{{ .ConfirmationURL }}`, `{{ .Token }}`, etc. Custom templates use `{{variableName}}` syntax (no dot prefix). Both use the `TemplateVariable` interface (renamed from `SupabaseVariable`, deprecated alias kept). Each variable has an `availableFor` list mapping it to applicable template types.

## Variant System

Each template type supports multiple variants (e.g., Default, Minimal, Branded for confirm-signup). Variants store independent `bodyHtml` and `subject` values. Users can create, duplicate, and delete variants. Active variant is tracked per template type.

## ShadCN Config

`components.json` uses new-york style, neutral base color, CSS variables enabled, Lucide icons. Components installed to `components/ui/`.
