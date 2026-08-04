import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Radar, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Immigration Radar" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 pt-20 pb-24">
      <Link to="/" className="flex items-center gap-2.5 justify-center mb-8 group">
        <div className="relative h-10 w-10 rounded-xl bg-hero-gradient grid place-items-center glow-cyan">
          <Radar className="h-5 w-5 text-white" />
        </div>
        <div className="font-display font-semibold tracking-tight text-lg">Immigration Radar</div>
      </Link>

      <div className="rounded-2xl ring-gradient bg-card-gradient p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email address and we'll send you a secure link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--success)]/20">
              <CheckCircle2 className="h-6 w-6 text-[color:var(--success)]" />
            </div>
            <h3 className="font-semibold text-white">Check your inbox</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We've sent a password reset link to <strong>{email}</strong>. Please check your spam folder if it doesn't arrive in a few minutes.
            </p>
            <div className="pt-2">
              <Link to="/auth" className="text-sm text-[color:var(--primary)] hover:underline font-medium">
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-background/60 border border-border pl-10 pr-3 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60"
                  placeholder="name@example.com"
                />
              </div>
            </label>

            {err && (
              <div className="text-sm text-[color:var(--danger)] bg-[color:var(--danger)]/10 border border-[color:var(--danger)]/30 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-4 py-3 glow-cyan hover:opacity-95 transition disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset link
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center pt-2">
            <Link to="/auth" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition">
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
