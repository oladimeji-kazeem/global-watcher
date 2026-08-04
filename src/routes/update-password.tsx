import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radar, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [{ title: "Update Password — Immigration Radar" }],
  }),
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase automatically parses the #access_token fragment from the reset email
    // and establishes a session. We just need to ensure the session exists.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setErr("Invalid or expired password reset link. Please request a new one.");
      }
    });

    // Listen for the specific PASSWORD_RECOVERY event
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setErr(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    setErr(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      setSuccess(true);
      
      // Auto-redirect after success
      setTimeout(() => {
        navigate({ to: "/watchlist" });
      }, 3000);
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
          <h1 className="text-2xl font-semibold tracking-tight">Create new password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Please enter your new password below. Make sure it's at least 6 characters.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--success)]/20">
              <CheckCircle2 className="h-6 w-6 text-[color:var(--success)]" />
            </div>
            <h3 className="font-semibold text-white">Password Updated</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your password has been successfully reset. Redirecting you to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">New Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-background/60 border border-border pl-10 pr-3 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Confirm New Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl bg-background/60 border border-border pl-10 pr-3 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60"
                  placeholder="••••••••"
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
              disabled={busy || !!err?.includes("Expired")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-4 py-3 glow-cyan hover:opacity-95 transition disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
