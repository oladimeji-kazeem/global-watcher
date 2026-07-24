import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppSidebarLayout, PageHeader } from "@/components/site-shell";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Shield, Bell, Save, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alerts, setAlerts] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || "");
        setFirstName(user.user_metadata?.first_name || "");
        setLastName(user.user_metadata?.last_name || "");
        setAlerts(user.user_metadata?.email_alerts ?? true);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);

    // Update user metadata in Supabase Auth
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        email_alerts: alerts
      }
    });

    setIsSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <AppSidebarLayout>
      <main>
        <PageHeader
          eyebrow="Account Settings"
          title={<>My <span className="text-gradient">Profile</span></>}
          description="Manage your personal details, security credentials, and email notification preferences."
        />

        <div className="mx-auto max-w-4xl px-6 pb-24">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">

              <section className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden">
                <div className="border-b border-border/40 px-6 py-4 flex items-center gap-3">
                  <User className="h-4 w-4 text-[color:var(--primary)]" />
                  <h2 className="text-[15px] font-semibold text-white">Personal Information</h2>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm focus:border-[color:var(--primary)] focus:outline-none transition"
                      placeholder="e.g. Amara"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm focus:border-[color:var(--primary)] focus:outline-none transition"
                      placeholder="e.g. Obi"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email Address</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full rounded-xl border border-border/50 bg-background/30 px-4 py-3 text-sm opacity-60 cursor-not-allowed"
                    />
                    <div className="text-[11px] text-muted-foreground/80 mt-1">Contact support to change your primary registered email address.</div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden">
                <div className="border-b border-border/40 px-6 py-4 flex items-center gap-3">
                  <Bell className="h-4 w-4 text-[color:var(--primary)]" />
                  <h2 className="text-[15px] font-semibold text-white">Notifications & Alerts</h2>
                </div>
                <div className="p-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={alerts}
                        onChange={(e) => setAlerts(e.target.checked)}
                      />
                      <div className="h-5 w-9 rounded-full bg-border transition peer-checked:bg-[color:var(--primary)] text-white relative before:absolute before:left-0.5 before:top-0.5 before:bottom-0.5 before:w-4 before:rounded-full before:bg-white before:transition peer-checked:before:translate-x-4 shadow-[0_0_15px_rgba(45,160,153,0)] peer-checked:shadow-[0_0_15px_rgba(45,160,153,0.3)]"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-[color:var(--primary)] transition">Priority Watchlist Alerts via Email</div>
                      <div className="text-xs text-muted-foreground/80 mt-0.5">Receive immediate notifications when policies change in your tracked jurisdictions.</div>
                    </div>
                  </label>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <button
                  onClick={handleSignOut}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[color:var(--destructive)]/30 text-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/10 text-sm font-medium transition"
                >
                  Sign Out
                </button>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {success && (
                    <span className="text-sm text-[color:var(--success)] flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2">
                      <CheckCircle2 className="h-4 w-4" /> Saved successfully
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-[color:var(--primary)] text-black text-sm font-semibold hover:bg-[color:var(--primary)]/90 transition disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </AppSidebarLayout>
  );
}
