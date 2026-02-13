# Plunk Template Factory

Visual editor for Supabase Auth email templates and custom email templates. Single-page Next.js app with a fixed sidebar + two-panel resizable layout: template sidebar, live preview, and code editor.

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Backend / Auth**: Supabase (Postgres + Auth via @supabase/supabase-js and @supabase/ssr)
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
  page.tsx            # Main page - auth gate (loading -> auth dialog -> editor), wires useAuth + useTemplateEditor
  globals.css         # Tailwind + ShadCN CSS variables (neutral base color)
  api/templates/
    route.ts          # GET/POST API route: reads/writes user_templates in Supabase Postgres (auth-gated)
  auth/confirm/
    route.ts          # Email OTP verification callback (verifyOtp then redirect to /)

middleware.ts         # Supabase session token refresh on every request

components/
  layout/
    app-header.tsx        # Top bar: logo, grouped template type selector, copy/export, Save/Load JSON buttons, user avatar dropdown with sign-out
    auth-dialog.tsx       # Sign-in / sign-up modal (email + password, email confirmation flow)
    template-sidebar.tsx  # Fixed left sidebar (320px, collapsible to 48px): templates grouped by category, variable quick-copy, new/delete custom template buttons
    preview-canvas.tsx    # Center resizable panel (40% default): iframe preview with desktop/mobile toggle
    editor-panel.tsx      # Right resizable panel (60% default): global view has Edit/Style/Variables tabs, per-template view has Edit/Variables/Variants tabs
    create-custom-template-dialog.tsx  # Dialog for creating custom template types with name, description, icon, and variable rows
    delete-variant-dialog.tsx          # Confirmation dialog for variant deletion
  editor/
    code-editor.tsx       # CodeMirror wrapper for HTML editing
    editor-toolbar.tsx    # Toolbar: format HTML (Prettier), wrap selection in tag, insert variable
    style-editor-tab.tsx  # Global style editor: brand, colors, buttons, typography, footer tokens
  ui/                     # ShadCN components (avatar, badge, button, card, dialog, etc.)

hooks/
  use-auth.ts             # Auth state hook: user, loading, isAuthenticated, signIn/signUp/signOut (wraps Supabase client auth)
  use-template-editor.ts  # Core state hook: accepts AuthState param, template selection, variant CRUD, HTML/subject editing, copy/export, exportJson/importJson, custom template CRUD, load/auto-save persistence
  use-keyboard-shortcuts.ts # Declarative keyboard shortcut hook (mod+key combos, respects input focus)

lib/
  supabase/
    client.ts      # Browser Supabase client (createBrowserClient from @supabase/ssr)
    server.ts      # Server Supabase client (createServerClient with cookie handling)
  types.ts         # SupabaseTemplateType, CustomTemplateType, TemplateType union, TemplateCategory, TemplateVariable, TemplateStyle, GlobalTemplate, BODY_PLACEHOLDER, DEFAULT_STYLE, isCustomTemplate()
  persistence.ts   # PersistedData interface (version, templates, globalTemplate, templateStyle, custom types/variables, activeVariantIds) + isValidPersistedData() type guard
  mock-data.ts     # 6 built-in Supabase template types, seed custom templates, templateVariables, seed custom variables
  format-html.ts   # Lazy-loads Prettier standalone to format HTML strings
  utils.ts         # cn() helper, dedent() for stripping template literal indentation, composeEmail() + applyStyleTokens()

supabase/
  config.toml                              # Supabase local dev config
  migrations/00001_create_user_templates.sql  # user_templates table, RLS policies, updated_at trigger
```

## Architecture

- **Client-side UI**: `page.tsx` is `"use client"`. No server actions.
- **Authentication**: Email/password auth via Supabase Auth. `useAuth` hook manages user state, sign-in, sign-up, and sign-out. `page.tsx` renders an auth gate: loading spinner -> `AuthDialog` -> editor. `middleware.ts` refreshes the session token on every request. `app/auth/confirm/route.ts` handles email OTP verification.
- **State management**: All editor state lives in `useTemplateEditor` hook, which now accepts an `AuthState` param (`{ isAuthenticated, user, loading }`). No external state libraries.
- **Persistence**: Editor state is stored per-user in the `user_templates` Supabase Postgres table (single JSONB row per user). The API route (`app/api/templates/route.ts`) requires auth and reads/upserts via `user_id`. On mount the hook fetches `GET /api/templates` and falls back to mock data if no row exists. State changes auto-save with a 1-second debounce via `POST /api/templates`. The `PersistedData` schema is versioned (`version: 1`) and validated by `isValidPersistedData()`. The hook exposes an `isLoaded` flag so the UI can wait for hydration.
- **JSON export/import**: `useTemplateEditor` exposes `exportJson()` (downloads full state as JSON file) and `importJson(file)` (validates and loads a JSON file). Buttons are in the header dropdown.
- **Database**: Single table `public.user_templates` with columns `id` (uuid PK), `user_id` (FK to auth.users, unique), `data` (jsonb), `updated_at`. RLS policies restrict all operations to the owning user. Migration in `supabase/migrations/00001_create_user_templates.sql`.
- **Supabase clients**: `lib/supabase/client.ts` (browser, `createBrowserClient`) and `lib/supabase/server.ts` (server, `createServerClient` with cookie handling). Both read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from env.
- **Mock/seed data**: `lib/mock-data.ts` provides initial template content and variables used when no persisted data is present. Template body HTML strings are wrapped in `dedent()` to strip source-code indentation; new templates should follow this pattern.
- **Global template + body**: A `GlobalTemplate` holds the full HTML document shell with a `<!-- BODY_CONTENT -->` placeholder (`BODY_PLACEHOLDER`). Each variant stores only its `bodyHtml`. `composeEmail()` in `lib/utils.ts` merges the global shell and body, applying style tokens.
- **Style tokens**: Templates use `{{STYLE_*}}` tokens (e.g. `{{STYLE_BRAND_COLOR}}`, `{{STYLE_BUTTON_BG}}`). `applyStyleTokens()` replaces these with values from the `TemplateStyle` object. The `StyleEditorTab` component lets users edit these values; `DEFAULT_STYLE` provides defaults.
- **Live preview**: Renders composed HTML in a sandboxed iframe (`allow-same-origin`).
- **Path aliases**: `@/*` maps to project root.

## Environment Variables

Required (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key

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
