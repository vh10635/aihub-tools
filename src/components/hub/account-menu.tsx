import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function AccountMenu() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return null;
  if (!user) return <Button variant="outline" asChild><Link to="/auth"><LogIn />Sign in</Link></Button>;
  const name = (user.user_metadata?.full_name as string) || user.email || "Account";
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  return (
    <div className="flex items-center gap-2">
      {avatar ? <img src={avatar} alt="" className="h-8 w-8 rounded-full" /> :
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{name[0]?.toUpperCase()}</span>}
      <span className="hidden max-w-32 truncate text-sm font-medium md:inline">{name}</span>
      <Button variant="ghost" size="icon" aria-label="Sign out" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }}><LogOut /></Button>
    </div>
  );
}
