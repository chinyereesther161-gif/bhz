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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { LogOut, Lock, Shield, User, Mail, Calendar, Wallet, Package, TrendingUp, Copy, Check, Plus, Trash2, Globe, Bell, Gift, Key, AlertTriangle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Investment = Tables<"investments">;

interface WithdrawalWallet {
  id: string;
  network: string;
  address: string;
}

const NETWORKS = ["USDT TRC20", "BTC", "ETH", "SOL"];

const Settings = () => {
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showRecoveryReset, setShowRecoveryReset] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [withdrawalWallets, setWithdrawalWallets] = useState<WithdrawalWallet[]>([]);
  const [newWalletNetwork, setNewWalletNetwork] = useState(NETWORKS[0]);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [showAddWallet, setShowAddWallet] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("investments").select("*").eq("user_id", user.id).eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setInvestments(data || []));
    const saved = localStorage.getItem(`withdrawal_wallets_${user.id}`);
    if (saved) setWithdrawalWallets(JSON.parse(saved));
  }, [user]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  const handleChangePassword = async () => {
    if (!oldPassword) { toast({ title: "Error", description: "Please enter your current password", variant: "destructive" }); return; }
    if (newPassword.length < 6) { toast({ title: "Error", description: "New password must be at least 6 characters", variant: "destructive" }); return; }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: profile?.email || "", password: oldPassword });
    if (signInError) { setLoading(false); toast({ title: "Error", description: "Current password is incorrect", variant: "destructive" }); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Password updated successfully" }); setOldPassword(""); setNewPassword(""); }
  };

  const handleRecoveryReset = async () => {
    if (!recoveryToken || !resetNewPassword) { toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" }); return; }
    if (resetNewPassword.length < 6) { toast({ title: "Error", description: "New password must be at least 6 characters", variant: "destructive" }); return; }
    setLoading(true);
    const { data: profileData } = await supabase.from("profiles").select("recovery_token").eq("user_id", user?.id || "").single();
    if (!profileData || profileData.recovery_token !== recoveryToken) { setLoading(false); toast({ title: "Error", description: "Invalid recovery token", variant: "destructive" }); return; }
    const { error } = await supabase.auth.updateUser({ password: resetNewPassword });
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Password reset successfully" }); setRecoveryToken(""); setResetNewPassword(""); setShowRecoveryReset(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") { toast({ title: "Error", description: "Please type DELETE to confirm", variant: "destructive" }); return; }
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("delete-account", { headers: { Authorization: `Bearer ${session?.access_token}` } });
      if (res.error) throw res.error;
      await signOut();
      navigate("/");
      toast({ title: "Account deleted", description: "Your account has been permanently deleted." });
    } catch (err: any) { toast({ title: "Error", description: err.message || "Failed to delete account", variant: "destructive" }); }
    setDeleting(false);
  };

  const handleLogout = async () => { await signOut(); navigate("/"); };

  const copyId = () => { navigator.clipboard.writeText(profile?.capvest_id || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyToken = () => { navigator.clipboard.writeText((profile as any)?.recovery_token || ""); setCopiedToken(true); setTimeout(() => setCopiedToken(false), 2000); };

  const referralLink = `${window.location.origin}/signup?ref=${(profile as any)?.referral_code || ""}`;
  const copyReferralLink = () => { navigator.clipboard.writeText(referralLink); setCopiedReferral(true); setTimeout(() => setCopiedReferral(false), 2000); };

  const addWithdrawalWallet = () => {
    if (!newWalletAddress.trim()) { toast({ title: "Error", description: "Please enter a wallet address", variant: "destructive" }); return; }
    const newWallet: WithdrawalWallet = { id: crypto.randomUUID(), network: newWalletNetwork, address: newWalletAddress.trim() };
    const updated = [...withdrawalWallets, newWallet];
    setWithdrawalWallets(updated);
    if (user) localStorage.setItem(`withdrawal_wallets_${user.id}`, JSON.stringify(updated));
    setNewWalletAddress(""); setShowAddWallet(false);
    toast({ title: "Wallet added", description: `${newWalletNetwork} withdrawal address saved` });
  };

  const removeWallet = (id: string) => {
    const updated = withdrawalWallets.filter(w => w.id !== id);
    setWithdrawalWallets(updated);
    if (user) localStorage.setItem(`withdrawal_wallets_${user.id}`, JSON.stringify(updated));
    toast({ title: "Wallet removed" });
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
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[10px] font-mono text-muted-foreground tracking-wide">{profile?.capvest_id}</p>
                    <button onClick={copyId} className="text-muted-foreground hover:text-primary transition-colors">
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recovery Token */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="bg-card/15 border-border/15 overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold">Recovery Token</h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Save this token securely. You can use it to reset your password if you forget it.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-xl bg-background/50 p-3 text-[11px] font-mono text-primary border border-border/10 select-all break-all">
                  {(profile as any)?.recovery_token || "Loading..."}
                </code>
                <Button variant="outline" size="icon" onClick={copyToken} className="shrink-0 h-10 w-10 rounded-xl border-border/15">
                  {copiedToken ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-destructive/[0.06] border border-destructive/15 p-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                <p className="text-[9px] text-destructive/80 font-medium">Store this token somewhere safe. Do not share it with anyone.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Program */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <Card className="overflow-hidden border-primary/15">
            <CardContent className="relative p-5 space-y-3">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold">Referral Program</h3>
                  <span className="text-[9px] bg-primary/10 text-primary border border-primary/15 px-2 py-0.5 rounded-full font-bold">$5 Bonus</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                  Invite friends and earn $5 for each friend who invests in a plan. Your friend gets a $10 welcome bonus too!
                </p>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground">Your Referral Code</Label>
                  <div className="flex items-center gap-2">
                    <code className="rounded-xl bg-background/50 px-3 py-2.5 text-sm font-mono font-bold text-primary border border-border/10">
                      {(profile as any)?.referral_code || "Loading..."}
                    </code>
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <Label className="text-[10px] font-bold text-muted-foreground">Referral Link</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-xl bg-background/50 p-2.5 text-[10px] font-mono text-muted-foreground border border-border/10 break-all select-all">
                      {referralLink}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyReferralLink} className="shrink-0 h-10 w-10 rounded-xl border-border/15">
                      {copiedReferral ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Overview */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-card/15 border-border/15 overflow-hidden">
            <CardContent className="p-0 divide-y divide-border/10">
              {[
                { icon: Wallet, label: "Available Balance", value: `$${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary" },
                { icon: Package, label: "Total Invested", value: `$${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary" },
                { icon: TrendingUp, label: "Weekly P&L", value: `${(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}$${(profile?.weekly_pnl ?? 0).toFixed(2)}`, color: (profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive" },
                { icon: Package, label: "Active Plans", value: `${investments.length} plan${investments.length !== 1 ? "s" : ""}`, color: "text-foreground" },
                { icon: Calendar, label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "-", color: "text-foreground" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdrawal Wallets */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/15 border-border/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-bold">Withdrawal Wallets</h3>
                </div>
                <button onClick={() => setShowAddWallet(!showAddWallet)} className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>

              {showAddWallet && (
                <div className="px-6 py-4 border-b border-border/10 space-y-3 bg-card/10">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold">Network</Label>
                    <select value={newWalletNetwork} onChange={e => setNewWalletNetwork(e.target.value)}
                      className="w-full h-10 rounded-xl bg-secondary/20 border border-border/15 px-3 text-xs">
                      {NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold">Wallet Address</Label>
                    <Input value={newWalletAddress} onChange={e => setNewWalletAddress(e.target.value)} placeholder="Enter wallet address..." className="h-10 bg-secondary/20 border-border/15 rounded-xl text-xs" />
                  </div>
                  <Button onClick={addWithdrawalWallet} size="sm" className="w-full h-9 text-xs font-bold rounded-xl">Save Wallet</Button>
                </div>
              )}

              {withdrawalWallets.length === 0 && !showAddWallet ? (
                <div className="px-6 py-6 text-center">
                  <Wallet className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-[11px] text-muted-foreground">No withdrawal wallets saved</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Add a wallet to speed up withdrawals</p>
                </div>
              ) : (
                <div className="divide-y divide-border/8">
                  {withdrawalWallets.map(w => (
                    <div key={w.id} className="flex items-center justify-between px-6 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-primary">{w.network}</p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">{w.address}</p>
                      </div>
                      <button onClick={() => removeWallet(w.id)} className="text-destructive/50 hover:text-destructive transition-colors p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Investments */}
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
                        <p className="text-[10px] text-muted-foreground">Since {new Date(inv.created_at).toLocaleDateString()}</p>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-bold">Change Password</h3>
                </div>
                <button onClick={() => setShowRecoveryReset(!showRecoveryReset)} className="text-[10px] text-primary font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>

              {!showRecoveryReset ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword" className="text-xs font-semibold">Current Password</Label>
                    <Input id="oldPassword" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password" className="h-11 bg-secondary/20 border-border/15 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-xs font-semibold">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" className="h-11 bg-secondary/20 border-border/15 rounded-xl" />
                  </div>
                  <Button onClick={handleChangePassword} disabled={loading} className="w-full h-11 text-xs font-bold rounded-xl">
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Enter your recovery token and a new password to reset your password.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Recovery Token</Label>
                    <Input type="text" value={recoveryToken} onChange={e => setRecoveryToken(e.target.value)} placeholder="Paste your recovery token" className="h-11 bg-secondary/20 border-border/15 rounded-xl font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">New Password</Label>
                    <Input type="password" value={resetNewPassword} onChange={e => setResetNewPassword(e.target.value)} placeholder="Enter new password" className="h-11 bg-secondary/20 border-border/15 rounded-xl" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowRecoveryReset(false)} className="flex-1 h-11 text-xs rounded-xl">Cancel</Button>
                    <Button onClick={handleRecoveryReset} disabled={loading} className="flex-1 h-11 text-xs font-bold rounded-xl">
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-3 rounded-2xl border border-border/15 bg-card/10 p-4">
            <Shield className="h-4 w-4 text-primary/60 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">Your account is protected with 256-bit encryption and secure authentication.</p>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button variant="outline" className="w-full h-12 gap-2 text-destructive border-destructive/15 hover:bg-destructive/[0.06] rounded-xl" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </motion.div>

        {/* Delete Account */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <button onClick={() => setShowDeleteDialog(true)} className="w-full text-center text-[11px] text-destructive/60 hover:text-destructive transition-colors py-3 font-medium">
            Delete Account Permanently
          </button>
        </motion.div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Delete Account
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action is <strong className="text-destructive">permanent and irreversible</strong>. All your data, investments, and balance will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Type DELETE to confirm</Label>
            <Input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" className="h-11 bg-secondary/20 border-destructive/15 rounded-xl font-mono uppercase" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setDeleteConfirm(""); }} className="border-border/40">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting || deleteConfirm !== "DELETE"} className="font-bold">
              {deleting ? "Deleting..." : "Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Settings;
