import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { BrandMark } from "@/components/hub/brand-mark";
import robot from "@/assets/ai-robot-banner.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AI Hub" },
      { name: "description", content: "Sign in or create your free AI Hub account to save and discover AI tools." },
      { property: "og:title", content: "Sign in — AI Hub" },
      { property: "og:description", content: "Create your free AI Hub account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/" }); });
    const { data } = supabase.auth.onAuthStateChange((e, s) => { if (e === "SIGNED_IN" && s) navigate({ to: "/" }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
        if (error) throw error;
        setSent("We sent a verification link to " + email + ". Click it to activate your account.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        setSent("If an account exists for " + email + ", a reset link is on its way.");
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  async function google() {
    setError("");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setError(r.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="auth-page">
      <section className="auth-art">
        <img src={robot} alt="" />
        <Link to="/" className="brand"><BrandMark /><span>AI<span className="brand-hub"> Hub</span></span></Link>
        <div>
          <h1>Your next big idea <span className="grad">starts here.</span></h1>
          <p className="mt-3 max-w-sm opacity-80">Save favourite tools, get smarter AI picks, and explore 300+ hand-picked apps.</p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          {sent ? (
            <div className="text-center">
              <MailCheck className="mx-auto mb-3 h-12 w-12 text-primary" />
              <h2 className="text-2xl font-bold">Check your inbox</h2>
              <p className="mt-2 text-sm text-muted-foreground">{sent}</p>
              <Button variant="outline" className="mt-6 w-full" onClick={() => { setSent(""); setMode("signin"); }}>Back to sign in</Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back"}</h2>
              <p className="mb-5 mt-1 text-sm text-muted-foreground">{mode === "forgot" ? "We'll email you a reset link." : "Sign in to keep exploring AI Hub."}</p>
              {mode !== "forgot" && (
                <div className="mb-5 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-medium" role="tablist">
                  {(["signin", "signup"] as const).map((m) => (
                    <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError(""); }}
                      className={`rounded-md py-2 transition ${mode === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{m === "signin" ? "Sign in" : "Create account"}</button>
                  ))}
                </div>
              )}
              <form onSubmit={submit} className="space-y-4">
                {mode === "signup" && <div><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} /></div>}
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                {mode !== "forgot" && <div>
                  <div className="flex justify-between"><Label htmlFor="password">Password</Label>
                    {mode === "signin" && <button type="button" className="text-xs text-primary" onClick={() => setMode("forgot")}>Forgot password?</button>}</div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>}
                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                <Button type="submit" disabled={busy} className="auth-gradient-btn w-full">{busy && <Loader2 className="animate-spin" />}{mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}</Button>
              </form>
              {mode === "forgot" ? <button className="mt-4 w-full text-sm text-muted-foreground" onClick={() => setMode("signin")}>Back to sign in</button> : <>
                <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
                <Button variant="outline" className="w-full" onClick={google}>
                  <img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" alt="" className="h-4 w-4" />Continue with Google
                </Button>
              </>}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
