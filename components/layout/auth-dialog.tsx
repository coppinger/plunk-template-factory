"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface AuthDialogProps {
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  onClose?: () => void;
}

export function AuthDialog({ onSignIn, onSignUp, onClose }: AuthDialogProps) {
  const [tab, setTab] = useState<string>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "sign-in") {
        const { error } = await onSignIn(email, password);
        if (error) setError(error.message);
      } else {
        const { error } = await onSignUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSignUpSuccess(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSignUpSuccess(false);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
      <DialogContent
        showCloseButton={!!onClose}
        onPointerDownOutside={(e) => { if (!onClose) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (!onClose) e.preventDefault(); }}
        className="sm:max-w-[420px]"
      >
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/[0.12] ring-1 ring-primary/20">
              <Mail className="h-4 w-4 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Plunk Template Factory</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to save and sync your email templates
          </DialogDescription>
        </DialogHeader>

        {signUpSuccess ? (
          <div className="rounded-lg border border-border/40 bg-secondary/30 p-4 text-center">
            <p className="text-sm text-foreground font-medium mb-1">Check your email</p>
            <p className="text-xs text-muted-foreground">
              We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>.
              Click the link to activate your account.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                resetForm();
                setTab("sign-in");
              }}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => { setTab(v); setError(null); }}>
            <TabsList className="w-full">
              <TabsTrigger value="sign-in" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <TabsContent value="sign-in" className="space-y-3 mt-0">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email" className="text-xs">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signin-password" className="text-xs">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    minLength={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sign-up" className="space-y-3 mt-0">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={6}
                  />
                </div>
              </TabsContent>

              {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Loading..."
                  : tab === "sign-in"
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
