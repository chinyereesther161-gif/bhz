import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Clock, ArrowRight, CheckCircle2, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const networks = [
  { id: "usdt", name: "USDT TRC20", symbol: "USDT", icon: "₮", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", activeBg: "bg-emerald-500/[0.08]" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", activeBg: "bg-amber-500/[0.08]" },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", activeBg: "bg-blue-500/[0.08]" },
  { id: "sol", name: "Solana", symbol: "SOL", icon: "◎", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", activeBg: "bg-purple-500/[0.08]" },
];

const Withdraw = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [network, setNetwork] = useState(networks[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState(profile?.email || "");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const numAmount = Number(amount);
  const balance = profile?.balance ?? 0;

  const handleSubmit = async () => {
    if (!user) return;
    if (numAmount < 50) {
      toast({ title: "Minimum $50", description: "Minimum withdrawal is $50.", variant: "destructive" });
      return;
    }
    if (numAmount > balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }
    if (!walletAddress.trim()) {
      toast({ title: "Error", description: "Enter your wallet address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id,
      amount: numAmount,
      network: network.name,
      wallet_address: walletAddress.trim(),
      email: email.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Withdrawal submitted", description: "Processing within 24 hours." });
      setAmount("");
      setWalletAddress("");
      setStep(1);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-black">Withdraw Funds</h1>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Available Balance: <span className="text-primary font-bold">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </motion.div>

        {/* Steps indicator */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center justify-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => s < step && setStep(s)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                  step >= s
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/30 text-muted-foreground/40 border border-border/20"
                }`}
              >
                {step > s ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
              </button>
              {s < 3 && <div className={`h-px w-8 transition-colors duration-300 ${step > s ? "bg-primary/40" : "bg-border/20"}`} />}
            </div>
          ))}
        </motion.div>

        {/* Step 1 — Network */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <p className="text-center text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">Select Network</p>
            <div className="grid grid-cols-2 gap-3">
              {networks.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setNetwork(n); setStep(2); }}
                  className={`group relative rounded-2xl border p-5 text-center transition-all duration-300 hover:scale-[1.02] ${
                    network.id === n.id
                      ? `${n.border} ${n.activeBg} shadow-lg`
                      : "border-border/15 bg-card/15 hover:border-primary/15 hover:bg-card/30"
                  }`}
                >
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b ${n.color}`}>
                    <span className="text-xl font-bold">{n.icon}</span>
                  </div>
                  <span className="block text-xs font-bold">{n.symbol}</span>
                  <span className="block text-[9px] text-muted-foreground/40 mt-0.5">{n.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/20 border-border/15 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border/10 px-5 py-3 bg-secondary/10">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-b ${network.color}`}>
                  <span className="text-sm font-bold">{network.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-bold">{network.symbol} Withdrawal</p>
                  <p className="text-[9px] text-muted-foreground/40">{network.name}</p>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Email Address</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="h-11 bg-secondary/20 border-border/15 rounded-xl text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{network.symbol} Wallet Address</Label>
                  <Input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder={`Enter your ${network.symbol} address`} className="h-11 bg-secondary/20 border-border/15 rounded-xl font-mono text-[11px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Amount (USD) — Min $50</Label>
                  <div className="relative">
                    <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50.00" min="50" className="h-11 bg-secondary/20 border-border/15 rounded-xl pl-7 text-xs" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/40 font-bold">$</span>
                  </div>
                  {numAmount > 0 && numAmount > balance && (
                    <p className="text-[10px] text-destructive font-medium">Exceeds available balance</p>
                  )}
                </div>
                <Button
                  className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/15 gap-2"
                  onClick={() => { if (walletAddress.trim() && numAmount >= 50 && numAmount <= balance) setStep(3); else handleSubmit(); }}
                  disabled={!walletAddress.trim() || numAmount < 50 || numAmount > balance}
                >
                  Review Withdrawal <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/20 border-border/15 overflow-hidden">
              <div className="border-b border-border/10 px-5 py-3 bg-secondary/10">
                <p className="text-xs font-bold">Confirm Withdrawal</p>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  {[
                    { label: "Network", value: network.name },
                    { label: "Wallet", value: walletAddress.slice(0, 12) + "..." + walletAddress.slice(-6) },
                    { label: "Amount", value: `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                    { label: "Fee", value: "Free" },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between rounded-xl bg-secondary/15 border border-border/10 px-4 py-3">
                      <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">{row.label}</span>
                      <span className="text-xs font-bold">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-primary/[0.04] border border-primary/15 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground/50">You will receive</p>
                  <p className="text-lg font-black text-primary">${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-muted-foreground/40">in {network.symbol}</p>
                </div>
                <Button className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/15" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Processing..." : "Confirm & Withdraw"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security badges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border/15 bg-card/15 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08]">
              <Shield className="h-4 w-4 text-primary/70" />
            </div>
            <div>
              <p className="text-[10px] font-bold">Secure</p>
              <p className="text-[9px] text-muted-foreground/40">256-bit encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/15 bg-card/15 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08]">
              <Clock className="h-4 w-4 text-primary/70" />
            </div>
            <div>
              <p className="text-[10px] font-bold">Fast</p>
              <p className="text-[9px] text-muted-foreground/40">Within 24 hours</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Withdraw;
