import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — AI Hub" },
      { name: "description", content: "Choose a new password for your AI Hub account." },
      { property: "og:title", content: "Set a new password — AI Hub" },
      { property: "og:description", content: "Choose a new password for your AI Hub account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg(error.message);
    navigate({ to: "/" });
  }
  return (
    <div className="auth-panel min-h-screen">
      <form onSubmit={submit} className="auth-card space-y-4">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <div><Label htmlFor="pw">New password</Label><Input id="pw" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {msg && <p className="text-sm text-destructive" role="alert">{msg}</p>}
        <Button type="submit" className="auth-gradient-btn w-full">Update password</Button>
      </form>
    </div>
  );
}
