import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Lock, Shield, ChevronRight } from "lucide-react";

const Settings = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated" });
      setNewPassword("");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <h1 className="text-xl font-black">Settings</h1>

        {/* Profile Card */}
        <Card className="bg-card/50 overflow-hidden">
          <CardContent className="relative p-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary">
                {(profile?.name?.[0] || "U").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{profile?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60">{profile?.capvest_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-card/30">
          <CardContent className="p-0 divide-y divide-border/30">
            {[
              { label: "Active Plan", value: profile?.active_plan || "None" },
              { label: "Balance", value: `$${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-card/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-bold">Change Password</h3>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs">New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="h-10 bg-secondary/30 border-border/40" />
            </div>
            <Button onClick={handleChangePassword} disabled={loading} className="w-full h-10 text-xs font-bold">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Security info */}
        <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/20 p-3">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <p className="text-[10px] text-muted-foreground">Your account is protected with 256-bit encryption and secure authentication.</p>
        </div>

        <Button variant="outline" className="w-full h-11 gap-2 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
};

export default Settings;
