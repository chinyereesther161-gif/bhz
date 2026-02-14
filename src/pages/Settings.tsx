import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Lock, Shield, User, Mail, Calendar, Wallet, Package, TrendingUp, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Investment = Tables<"investments">;

const Settings = () => {
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("investments").select("*").eq("user_id", user.id).eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setInvestments(data || []));
  }, [user]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

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

  const copyId = () => {
    navigator.clipboard.writeText(profile?.capvest_id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-black">Settings</h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glow-border overflow-hidden">
            <CardContent className="relative p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 text-xl font-black text-primary">
                  {(profile?.name?.[0] || "U").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{profile?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground/50 truncate">{profile?.email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[10px] font-mono text-muted-foreground/30 tracking-wide">{profile?.capvest_id}</p>
                    <button onClick={copyId} className="text-muted-foreground/30 hover:text-primary transition-colors">
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Overview */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/15 border-border/15 overflow-hidden">
            <CardContent className="p-0 divide-y divide-border/10">
              {[
                { icon: Wallet, label: "Available Balance", value: `$${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary" },
                { icon: Package, label: "Total Invested", value: `$${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary" },
                { icon: TrendingUp, label: "Weekly P&L", value: `${(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}$${(profile?.weekly_pnl ?? 0).toFixed(2)}`, color: (profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive" },
                { icon: Package, label: "Active Plans", value: `${investments.length} plan${investments.length !== 1 ? "s" : ""}`, color: "text-foreground" },
                { icon: Calendar, label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—", color: "text-foreground" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground/30" />
                    <span className="text-xs text-muted-foreground/40 font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Investments Detail */}
        {investments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="bg-card/15 border-border/15 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-6 py-3 border-b border-border/10">
                  <h3 className="text-xs font-bold">Active Investment Plans</h3>
                </div>
                <div className="divide-y divide-border/10">
                  {investments.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="text-xs font-bold">{inv.plan_name}</p>
                        <p className="text-[10px] text-muted-foreground/30">Since {new Date(inv.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm font-black text-primary">${inv.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/15 border-border/15">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground/50" />
                <h3 className="text-xs font-bold">Change Password</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs font-semibold">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="h-11 bg-secondary/20 border-border/15 rounded-xl" />
              </div>
              <Button onClick={handleChangePassword} disabled={loading} className="w-full h-11 text-xs font-bold rounded-xl">
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-3 rounded-2xl border border-border/15 bg-card/10 p-4">
            <Shield className="h-4 w-4 text-primary/50 shrink-0" />
            <p className="text-[10px] text-muted-foreground/40 leading-relaxed">Your account is protected with 256-bit encryption and secure authentication.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button variant="outline" className="w-full h-12 gap-2 text-destructive border-destructive/15 hover:bg-destructive/[0.06] rounded-xl" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;
