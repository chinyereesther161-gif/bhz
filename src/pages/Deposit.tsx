import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertTriangle, Info, Wallet, ArrowRight, Shield, Clock, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const networkMeta: Record<string, { icon: string; color: string; bg: string }> = {
  "USDT TRC20": { icon: "₮", color: "text-success", bg: "bg-success/10 border-success/20" },
  "Bitcoin": { icon: "₿", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  "Ethereum": { icon: "Ξ", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  "Solana": { icon: "◎", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
};

const quickAmounts = [100, 250, 500, 1000, 2500, 5000];

interface UserWallet {
  network: string;
  wallet_address: string;
}

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!user) return;
    const fetchWallets = async () => {
      const { data } = await supabase
        .from("user_wallets")
        .select("network, wallet_address")
        .eq("user_id", user.id);
      if (data && data.length > 0) {
        setWallets(data);
        setSelectedWallet(data[0]);
      }
    };
    fetchWallets();
  }, [user]);

  const meta = selectedWallet ? (networkMeta[selectedWallet.network] || { icon: "•", color: "text-primary", bg: "bg-primary/10 border-primary/20" }) : null;

  const copyAddress = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!user || !amount || Number(amount) <= 0 || !selectedWallet) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("deposits").insert({
      user_id: user.id,
      amount: Number(amount),
      network: selectedWallet.network,
      wallet_address: selectedWallet.wallet_address,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deposit submitted", description: "Pending verification — usually within 24h." });
      setAmount("");
      setStep(1);
    }
  };

  if (wallets.length === 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-lg flex flex-col items-center justify-center py-20 text-center space-y-3">
          <Wallet className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground/60">No deposit wallets assigned yet. Please contact support.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Fund Your Account
            </h1>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">Secure deposits via cryptocurrency</p>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-2">
          {[
            { icon: Shield, label: "Encrypted", sub: "256-bit SSL" },
            { icon: Clock, label: "Fast", sub: "Under 24h" },
            { icon: Zap, label: "Instant", sub: "On-chain confirm" },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-card/30 border border-border/20 p-3 text-center">
              <b.icon className="h-4 w-4 text-primary/70" />
              <div>
                <p className="text-[10px] font-bold">{b.label}</p>
                <p className="text-[8px] text-muted-foreground/40">{b.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress Steps */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-1">
            {[
              { num: 1, label: "Select Network" },
              { num: 2, label: "Enter Amount" },
              { num: 3, label: "Send & Submit" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold transition-all w-full ${
                    step === s.num
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : step > s.num
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-card/20 text-muted-foreground/40 border border-border/15"
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                    step > s.num ? "bg-success text-white" : step === s.num ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground/40"
                  }`}>
                    {step > s.num ? "✓" : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 2 && <ArrowRight className="h-3 w-3 text-muted-foreground/20 shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 1: Network Selection */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <Label className="text-xs font-bold">Choose Network</Label>
            <div className="grid grid-cols-2 gap-2.5">
              {wallets.map(w => {
                const m = networkMeta[w.network] || { icon: "•", color: "text-primary", bg: "bg-primary/10 border-primary/20" };
                return (
                  <button
                    key={w.network}
                    onClick={() => { setSelectedWallet(w); setStep(2); }}
                    className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 hover:scale-[1.02] ${
                      selectedWallet?.network === w.network
                        ? `${m.bg} shadow-lg`
                        : "border-border/15 bg-card/15 hover:border-primary/15 hover:bg-card/30"
                    }`}
                  >
                    <span className={`block text-2xl font-black ${m.color}`}>{m.icon}</span>
                    <span className="block text-xs font-bold mt-2">{w.network.split(' ')[0]}</span>
                    <span className="block text-[9px] text-muted-foreground/40 mt-0.5">{w.network}</span>
                    {selectedWallet?.network === w.network && (
                      <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-success" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && selectedWallet && meta && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-xs font-bold">Deposit Amount</Label>
              <button onClick={() => setStep(1)} className="text-[10px] text-primary font-semibold hover:underline">
                ← Change Network
              </button>
            </div>

            <Card className="bg-card/20 border-border/15 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center border-b border-border/15">
                  <span className="pl-4 text-lg font-black text-muted-foreground/30">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="1"
                    className="border-0 bg-transparent h-14 text-xl font-black focus-visible:ring-0 placeholder:text-muted-foreground/20"
                  />
                  <span className="pr-4 text-[10px] font-bold text-muted-foreground/30 uppercase">USD</span>
                </div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {quickAmounts.map(qa => (
                    <button
                      key={qa}
                      onClick={() => setAmount(String(qa))}
                      className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${
                        amount === String(qa)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/30 text-muted-foreground/60 hover:bg-secondary/50"
                      }`}
                    >
                      ${qa.toLocaleString()}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 rounded-xl bg-card/20 border border-border/15 p-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.bg} ${meta.color} text-sm font-black`}>
                {meta.icon}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground/40">Sending via</p>
                <p className="text-xs font-bold">{selectedWallet.network}</p>
              </div>
            </div>

            <Button className="w-full h-12 font-bold rounded-xl" onClick={() => { if (amount && Number(amount) > 0) setStep(3); else toast({ title: "Enter amount", description: "Please enter a valid deposit amount", variant: "destructive" }); }}>
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Step 3: Send & Confirm */}
        {step === 3 && selectedWallet && meta && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold">Send & Confirm</Label>
              <button onClick={() => setStep(2)} className="text-[10px] text-primary font-semibold hover:underline">
                ← Change Amount
              </button>
            </div>

            <Card className="bg-primary/[0.04] border-primary/15 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-muted-foreground/40 font-medium uppercase tracking-wider">You are depositing</p>
                    <p className="text-2xl font-black text-primary mt-0.5">${Number(amount).toLocaleString()}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bg} ${meta.color} text-xl font-black`}>
                    {meta.icon}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-2">via {selectedWallet.network}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/20 border-border/15">
              <CardContent className="p-4">
                <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">
                  Send exactly ${Number(amount).toLocaleString()} in {selectedWallet.network} to:
                </Label>
                <div className="mt-2.5 flex items-center gap-2">
                  <code className="flex-1 break-all rounded-xl bg-secondary/30 p-3 text-[10px] font-mono text-foreground/70 border border-border/15 leading-relaxed">
                    {selectedWallet.wallet_address}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyAddress} className="shrink-0 h-10 w-10 rounded-xl border-border/20 hover:bg-primary/10 hover:border-primary/20 transition-all">
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && <p className="text-[9px] text-success font-semibold mt-2">Address copied to clipboard</p>}
              </CardContent>
            </Card>

            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/15 bg-destructive/[0.03] p-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                Only send <span className="font-bold text-foreground/80">{selectedWallet.network}</span> to this address. Sending other tokens will result in permanent loss.
              </p>
            </div>

            <Button className="w-full h-13 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all text-sm" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "I've Sent the Payment — Confirm Deposit"}
            </Button>

            <p className="text-center text-[9px] text-muted-foreground/30">
              Your deposit will be verified and credited within 24 hours
            </p>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/10 border-border/15">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-3.5 w-3.5 text-primary/70" />
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">How Deposits Work</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Select your preferred cryptocurrency network",
                  "Enter the amount you wish to deposit",
                  "Copy the wallet address and send crypto",
                  "Confirm and wait for verification (under 24h)",
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-background/30 border border-border/10 p-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[8px] font-black text-primary mt-0.5">{i + 1}</span>
                    <span className="text-[10px] text-muted-foreground/50 leading-relaxed">{s}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Deposit;
