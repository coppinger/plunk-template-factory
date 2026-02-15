"use client";

import { Button } from "@/components/ui/button";
import {
  Mail,
  Eye,
  Code,
  Palette,
  Layers,
  ArrowRight,
  Columns2,
  Braces,
  FolderOpen,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border/40 bg-card/50 p-5 transition-colors hover:border-primary/20 hover:bg-card">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/[0.1] ring-1 ring-primary/20">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function EditorMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.25)]">
      {/* Title bar */}
      <div className="flex h-10 items-center border-b border-border/40 bg-[#111114] px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/[0.12] ring-1 ring-primary/20">
            <Mail className="h-2.5 w-2.5 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground/80">
            Plunk Template Factory
          </span>
        </div>
        <div className="mx-3 h-3 w-px bg-border/40" />
        <div className="flex items-center gap-1.5">
          <div className="h-5 rounded bg-secondary/50 px-2 text-[10px] leading-5 text-muted-foreground">
            Confirm Signup
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-5 rounded bg-secondary/40 px-2 text-[10px] leading-5 text-muted-foreground">
            Copy
          </div>
          <div className="h-5 rounded bg-secondary/40 px-2 text-[10px] leading-5 text-muted-foreground">
            Export
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex h-[280px]">
        {/* Sidebar mock */}
        <div className="w-[140px] shrink-0 border-r border-border/40 bg-[#111114] p-2.5">
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Supabase Auth
          </div>
          <div className="space-y-0.5">
            <div className="rounded px-2 py-1 text-[10px] bg-primary/[0.08] text-primary font-medium">
              Confirm Signup
            </div>
            <div className="rounded px-2 py-1 text-[10px] text-muted-foreground/70">
              Invite User
            </div>
            <div className="rounded px-2 py-1 text-[10px] text-muted-foreground/70">
              Magic Link
            </div>
            <div className="rounded px-2 py-1 text-[10px] text-muted-foreground/70">
              Reset Password
            </div>
            <div className="rounded px-2 py-1 text-[10px] text-muted-foreground/70">
              Change Email
            </div>
          </div>
          <div className="mt-3 mb-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Custom
          </div>
          <div className="space-y-0.5">
            <div className="rounded px-2 py-1 text-[10px] text-muted-foreground/70">
              Welcome Email
            </div>
            <div className="rounded px-2 py-1 text-[10px] text-muted-foreground/70">
              Invoice
            </div>
          </div>
        </div>

        {/* Preview panel mock */}
        <div className="flex-1 border-r border-border/30 canvas-grid p-4">
          <div className="mx-auto h-full max-w-[200px] overflow-hidden rounded-md border border-border/30 bg-white shadow-sm">
            {/* Email preview mockup */}
            <div className="border-b border-gray-100 bg-white p-3 text-center">
              <div className="mx-auto mb-1.5 h-5 w-5 rounded bg-[#d4943c]/20" />
              <div className="mb-1 text-[8px] font-semibold text-gray-800">
                Confirm your email
              </div>
              <div className="mx-auto mb-2 h-1 w-24 rounded-full bg-gray-200" />
              <div className="space-y-0.5">
                <div className="mx-auto h-1 w-32 rounded-full bg-gray-100" />
                <div className="mx-auto h-1 w-28 rounded-full bg-gray-100" />
              </div>
            </div>
            <div className="space-y-2 p-3">
              <div className="mx-auto h-5 w-24 rounded bg-[#d4943c] text-center text-[7px] font-medium leading-5 text-white">
                Confirm Email
              </div>
              <div className="space-y-0.5">
                <div className="mx-auto h-1 w-28 rounded-full bg-gray-100" />
                <div className="mx-auto h-1 w-20 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Code editor mock */}
        <div className="flex-1 bg-[#141418] p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
              Edit
            </div>
            <div className="rounded px-2 py-0.5 text-[9px] text-muted-foreground/60">
              Variables
            </div>
            <div className="rounded px-2 py-0.5 text-[9px] text-muted-foreground/60">
              Variants
            </div>
          </div>
          <div className="space-y-1 font-mono">
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                1
              </span>
              <span className="text-[9px]">
                <span className="text-blue-400">&lt;h2&gt;</span>
                <span className="text-foreground/80">Confirm your email</span>
                <span className="text-blue-400">&lt;/h2&gt;</span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                2
              </span>
              <span className="text-[9px]">
                <span className="text-blue-400">&lt;p&gt;</span>
                <span className="text-foreground/80">Click below to</span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                3
              </span>
              <span className="text-[9px] text-foreground/80">
                &nbsp;&nbsp;confirm your account
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                4
              </span>
              <span className="text-[9px]">
                <span className="text-blue-400">&lt;/p&gt;</span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                5
              </span>
              <span className="text-[9px]">
                <span className="text-blue-400">&lt;a </span>
                <span className="text-green-400">href</span>
                <span className="text-foreground/60">=</span>
                <span className="text-[#d4943c]">
                  {'"{{ .ConfirmationURL }}"'}
                </span>
                <span className="text-blue-400">&gt;</span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                6
              </span>
              <span className="text-[9px]">
                <span className="text-foreground/80">
                  &nbsp;&nbsp;Confirm Email
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-4 text-right text-[9px] text-muted-foreground/30">
                7
              </span>
              <span className="text-[9px]">
                <span className="text-blue-400">&lt;/a&gt;</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-[#111114]">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.12] ring-1 ring-primary/20">
              <Mail className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Plunk Template Factory
            </span>
          </div>
          <Button size="sm" className="h-8 gap-1.5" onClick={onGetStarted}>
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs text-primary">
            <Braces className="h-3 w-3" />
            Open Source & Free
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Beautiful email templates,
            <br />
            <span className="text-primary">built visually</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A visual editor for Supabase Auth email templates and custom
            transactional emails. Design, preview, and export production-ready
            HTML emails — all from your browser.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" className="gap-2" onClick={onGetStarted}>
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-border/40"
              asChild
            >
              <a
                href="https://github.com/nicholasoxford/plunk-template-factory"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Editor mockup */}
        <EditorMockup />
      </section>

      {/* Features grid */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              Everything you need to craft perfect emails
            </h2>
            <p className="text-sm text-muted-foreground">
              Built for developers who care about the details
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Eye}
              title="Live Preview"
              description="See your changes instantly with a real-time preview. Toggle between desktop and mobile views to ensure responsive design."
            />
            <FeatureCard
              icon={Code}
              title="Code Editor"
              description="Full CodeMirror editor with syntax highlighting, HTML formatting via Prettier, and quick tag insertion tools."
            />
            <FeatureCard
              icon={Palette}
              title="Global Styling"
              description="Define brand colors, button styles, typography, and footer content once — apply them across all templates automatically."
            />
            <FeatureCard
              icon={Layers}
              title="Template Variants"
              description="Create multiple variants per template type. Compare Default, Minimal, and Branded designs side by side."
            />
            <FeatureCard
              icon={Columns2}
              title="Supabase Auth Ready"
              description="Pre-built templates for all six Supabase Auth email types: Confirm Signup, Invite User, Magic Link, and more."
            />
            <FeatureCard
              icon={FolderOpen}
              title="Projects & Export"
              description="Organize templates into projects. Export individual HTML files, download all as ZIP, or save/load full JSON backups."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              How it works
            </h2>
            <p className="text-sm text-muted-foreground">
              From template to production in three steps
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/[0.1] text-sm font-bold text-primary ring-1 ring-primary/20">
                1
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                Pick a template
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Start with a Supabase Auth template or create a custom one for
                any transactional email.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/[0.1] text-sm font-bold text-primary ring-1 ring-primary/20">
                2
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                Design & preview
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Edit HTML with live preview, customize styles, and create
                variants for different looks.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/[0.1] text-sm font-bold text-primary ring-1 ring-primary/20">
                3
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                Export & deploy
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Copy the HTML, export as files, or download a ZIP with all your
                templates ready for Supabase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="mb-3 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/[0.12] ring-1 ring-primary/20">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            Ready to build better emails?
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Free and open source. Sign up to save and sync your templates.
          </p>
          <Button size="lg" className="gap-2" onClick={onGetStarted}>
            Get Started for Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-[#111114]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/[0.12] ring-1 ring-primary/20">
              <Mail className="h-2.5 w-2.5 text-primary" />
            </div>
            Plunk Template Factory
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://github.com/nicholasoxford/plunk-template-factory"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <span className="text-border">GPL-3.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
