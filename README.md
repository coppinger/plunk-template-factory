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
- **Auto-save** — Editor state persists to your Supabase database automatically with 1-second debounce
- **Export** — Copy to clipboard, download as HTML, or export all templates as a ZIP archive
- **Plain text generation** — Auto-generate plain text versions from your HTML templates
- **Dark mode** — Full dark mode UI
- **Collapsible sidebar** — Fixed sidebar (320px) that collapses to 48px for more editing space

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Supabase Setup

1. Create a new Supabase project (or use an existing one)
2. Run the migration to create the `user_templates` table:

   ```sql
   -- Copy the contents of supabase/migrations/00001_create_user_templates.sql
   -- and run it in the Supabase SQL Editor (Dashboard > SQL Editor)
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   You'll need your **Project URL** and **anon/public key** from the Supabase dashboard (Settings > API).

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start editing templates.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Supabase](https://supabase.com) (Postgres + Auth)
- [Tailwind CSS 4](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com) (Radix primitives + Lucide icons)
- [CodeMirror 6](https://codemirror.net) via `@uiw/react-codemirror`

## Project Structure

```
app/
  layout.tsx          # Root layout with DM Sans/Fira Code fonts, TooltipProvider
  page.tsx            # Main page — auth gate (loading -> auth dialog -> editor)
  globals.css         # Tailwind + ShadCN CSS variables
  api/templates/
    route.ts          # GET/POST API: reads/writes user_templates in Supabase Postgres
  auth/confirm/
    route.ts          # Email OTP verification callback

middleware.ts         # Supabase session token refresh on every request

components/
  layout/
    app-header.tsx                     # Top bar: logo, template type selector, copy/export, save/load JSON
    auth-dialog.tsx                    # Sign-in / sign-up modal (email + password)
    template-sidebar.tsx               # Fixed sidebar: templates grouped by category, variable quick-copy
    preview-canvas.tsx                 # Center panel: live iframe preview with device toggle
    editor-panel.tsx                   # Right panel: tabbed Edit/Style/Variables/Variants panes
    create-custom-template-dialog.tsx  # Dialog for creating custom template types
    delete-variant-dialog.tsx          # Confirmation dialog for variant deletion
  editor/
    code-editor.tsx       # CodeMirror wrapper for HTML editing
    editor-toolbar.tsx    # Toolbar: format HTML, wrap selection, insert variable
    style-editor-tab.tsx  # Global style editor: brand, colors, buttons, typography
  ui/                     # ShadCN components

hooks/
  use-auth.ts               # Auth state: user, signIn/signUp/signOut
  use-template-editor.ts    # Core state: template selection, variant CRUD, persistence
  use-keyboard-shortcuts.ts # Declarative keyboard shortcut hook

lib/
  supabase/
    client.ts      # Browser Supabase client
    server.ts      # Server Supabase client (cookie handling)
  types.ts         # Template type definitions, categories, variable interfaces
  persistence.ts   # PersistedData schema and validation
  mock-data.ts     # Seed template content, variables, and custom template definitions
  format-html.ts   # HTML formatting via Prettier (lazy-loaded)
  utils.ts         # cn() helper, dedent(), composeEmail(), applyStyleTokens()

supabase/
  migrations/00001_create_user_templates.sql  # user_templates table, RLS policies
```

## How It Works

The UI is entirely client-side — all editor state lives in a single `useTemplateEditor` hook. Templates are composed by injecting body content into a global HTML layout, with style tokens replaced at render time. The result is a self-contained HTML email you can paste directly into your Supabase Auth email template settings or use for custom email flows.

State is persisted per-user in a Supabase Postgres table (`user_templates`) via a Next.js API route. Authentication uses Supabase Auth (email + password). On first load, the editor falls back to seed data from `lib/mock-data.ts`. Changes auto-save with a 1-second debounce.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
