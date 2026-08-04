import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radar, Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Immigration Radar" },
      { name: "description", content: "Sign in to save your immigration watchlist and receive email alerts." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/watchlist" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/watchlist` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/watchlist" });
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong.");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google", 
      options: { redirectTo: window.location.origin } 
    });
    if (error) { setErr(error.message); setBusy(false); return; }
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
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to sync your watchlist and receive alerts." : "Save your watchlist across devices and get email alerts."}
          </p>
        </div>

        <button type="button" onClick={google} disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-medium hover:bg-background/80 transition disabled:opacity-50">
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.65 4.1-5.5 4.1-3.31 0-6-2.74-6-6.1s2.69-6.1 6-6.1c1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.9 3.4 14.7 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 12s4.1 9.6 9.2 9.6c5.31 0 8.83-3.73 8.83-8.98 0-.6-.06-1.06-.15-1.52H12z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative text-center">
          <div className="absolute inset-x-0 top-1/2 border-t border-border/60" />
          <span className="relative bg-card/40 backdrop-blur px-3 text-[10px] uppercase tracking-widest text-muted-foreground">or with email</span>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-background/60 border border-border pl-10 pr-3 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60" />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Password</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-background/60 border border-border pl-10 pr-3 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60" />
            </div>
          </label>

          {mode === "signin" && (
            <div className="flex justify-end">
              <Link to="/reset-password" className="text-xs text-[color:var(--primary)] hover:underline">
                Forgot password?
              </Link>
            </div>
          )}

          {err && <div className="text-sm text-[color:var(--danger)] bg-[color:var(--danger)]/10 border border-[color:var(--danger)]/30 rounded-lg px-3 py-2">{err}</div>}

          <button type="submit" disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-4 py-3 glow-cyan hover:opacity-95 transition disabled:opacity-50">
            {mode === "signin" ? <><LogIn className="h-4 w-4"/> Sign in</> : <><UserPlus className="h-4 w-4"/> Create account</>}
          </button>
        </form>

        <div className="text-xs text-center text-muted-foreground">
          {mode === "signin" ? (
            <>New here? <button type="button" onClick={() => setMode("signup")} className="text-[color:var(--primary)] hover:underline">Create an account</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => setMode("signin")} className="text-[color:var(--primary)] hover:underline">Sign in</button></>
          )}
        </div>
      </div>
    </main>
  );
}
