import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertTriangle, Info, Wallet, ArrowRight, Shield, Clock, Zap, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const networkMeta: Record<string, { name: string; symbol: string; color: string; bgClass: string; borderClass: string; logoSvg: React.ReactNode }> = {
  "USDT TRC20": {
    name: "Tether",
    symbol: "USDT",
    color: "#26A17B",
    bgClass: "bg-[#26A17B]/10",
    borderClass: "border-[#26A17B]/25",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <circle cx="16" cy="16" r="16" fill="#26A17B"/>
        <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" fill="#fff"/>
      </svg>
    ),
  },
  "BTC": {
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    bgClass: "bg-[#F7931A]/10",
    borderClass: "border-[#F7931A]/25",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <circle cx="16" cy="16" r="16" fill="#F7931A"/>
        <path d="M22.5 14.13c.31-2.1-1.28-3.22-3.46-3.97l.71-2.83-1.73-.43-.69 2.76c-.45-.11-.92-.22-1.38-.32l.69-2.78-1.72-.43-.7 2.83c-.38-.09-.74-.17-1.1-.26l-2.38-.59-.46 1.85s1.28.29 1.25.31c.7.18.83.63.81 1l-.81 3.26c.05.01.11.03.18.06l-.18-.05-1.14 4.57c-.09.21-.3.53-.79.41.02.02-1.25-.31-1.25-.31l-.86 1.98 2.25.56c.42.1.83.21 1.23.31l-.71 2.86 1.72.43.71-2.84c.47.13.93.25 1.38.36l-.7 2.82 1.73.43.71-2.85c2.91.55 5.1.33 6.02-2.31.74-2.12-.04-3.34-1.57-4.14 1.12-.26 1.96-1 2.18-2.52zm-3.9 5.47c-.53 2.12-4.08.97-5.24.69l.94-3.75c1.16.29 4.86.86 4.3 3.06zm.53-5.5c-.48 1.93-3.44.95-4.4.71l.85-3.4c.96.24 4.06.69 3.55 2.69z" fill="#fff"/>
      </svg>
    ),
  },
  "SOL": {
    name: "Solana",
    symbol: "SOL",
    color: "#9945FF",
    bgClass: "bg-[#9945FF]/10",
    borderClass: "border-[#9945FF]/25",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <circle cx="16" cy="16" r="16" fill="#9945FF"/>
        <path d="M9.5 20.5l2.1-2.1c.1-.1.3-.2.5-.2h11.4c.3 0 .5.4.3.6l-2.1 2.1c-.1.1-.3.2-.5.2H9.8c-.3 0-.5-.4-.3-.6zm2.1-7.3c.1-.1.3-.2.5-.2h11.4c.3 0 .5.4.3.6l-2.1 2.1c-.1.1-.3.2-.5.2H9.8c-.3 0-.5-.4-.3-.6l2.1-2.1zm9.7-4.4l-2.1 2.1c-.1.1-.3.2-.5.2H7.3c-.3 0-.5-.4-.3-.6l2.1-2.1c.1-.1.3-.2.5-.2h11.4c.3 0 .5.4.3.6z" fill="#fff"/>
      </svg>
    ),
  },
  "ETH": {
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    bgClass: "bg-[#627EEA]/10",
    borderClass: "border-[#627EEA]/25",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <circle cx="16" cy="16" r="16" fill="#627EEA"/>
        <path d="M16.498 4v8.87l7.497 3.35z" fill="#fff" fillOpacity=".602"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#fff"/>
        <path d="M16.498 21.968v6.027L24 17.616z" fill="#fff" fillOpacity=".602"/>
        <path d="M16.498 27.995v-6.028L9 17.616z" fill="#fff"/>
        <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="#fff" fillOpacity=".2"/>
        <path d="M9 16.22l7.498 4.353v-7.701z" fill="#fff" fillOpacity=".602"/>
      </svg>
    ),
  },
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
      }
    };
    fetchWallets();
  }, [user]);

  const meta = selectedWallet ? networkMeta[selectedWallet.network] : null;

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
      setSelectedWallet(null);
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
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-black">Fund Your Account</h1>
              <p className="text-[11px] text-muted-foreground/60">Secure crypto deposits — credited within 24 hours</p>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "SSL Encrypted", sub: "256-bit security", color: "text-success" },
            { icon: Clock, label: "Fast Processing", sub: "Under 24 hours", color: "text-primary" },
            { icon: Zap, label: "On-Chain Verified", sub: "Blockchain confirmed", color: "text-purple-400" },
          ].map(b => (
            <Card key={b.label} className="bg-card/20 border-border/15">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card/40 border border-border/20">
                  <b.icon className={`h-4 w-4 ${b.color}`} />
                </div>
                <div>
                  <p className="text-[11px] font-bold">{b.label}</p>
                  <p className="text-[9px] text-muted-foreground/40">{b.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Progress Steps */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: "Select Network" },
              { num: 2, label: "Enter Amount" },
              { num: 3, label: "Send & Confirm" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => { if (s.num < step) setStep(s.num); }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-bold transition-all w-full ${
                    step === s.num
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : step > s.num
                      ? "bg-success/10 text-success border border-success/20 cursor-pointer"
                      : "bg-card/20 text-muted-foreground/30 border border-border/10"
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    step > s.num ? "bg-success text-white" : step === s.num ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted-foreground/30"
                  }`}>
                    {step > s.num ? "✓" : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/15 shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Network Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Choose Deposit Network</Label>
              <div className="grid grid-cols-2 gap-3">
                {wallets.map(w => {
                  const m = networkMeta[w.network];
                  if (!m) return null;
                  const isSelected = selectedWallet?.network === w.network;
                  return (
                    <button
                      key={w.network}
                      onClick={() => { setSelectedWallet(w); setStep(2); }}
                      className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 hover:scale-[1.02] ${
                        isSelected
                          ? `${m.bgClass} ${m.borderClass} shadow-lg`
                          : "border-border/15 bg-card/15 hover:border-border/30 hover:bg-card/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {m.logoSvg}
                        <div>
                          <p className="text-sm font-black">{m.symbol}</p>
                          <p className="text-[10px] text-muted-foreground/50">{m.name}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground/40">{w.network}</p>
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-success">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Supported networks info */}
              <Card className="bg-card/10 border-border/10">
                <CardContent className="p-4">
                  <p className="text-[10px] text-muted-foreground/40 leading-relaxed">
                    <span className="font-bold text-muted-foreground/60">Note:</span> Only send the correct cryptocurrency to its corresponding network address. Sending tokens on the wrong network will result in permanent loss.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Amount */}
          {step === 2 && selectedWallet && meta && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Deposit Amount</Label>
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline">
                  <ChevronLeft className="h-3 w-3" /> Change Network
                </button>
              </div>

              {/* Selected network badge */}
              <div className={`inline-flex items-center gap-2.5 rounded-xl ${meta.bgClass} ${meta.borderClass} border px-4 py-2.5`}>
                {meta.logoSvg}
                <div>
                  <p className="text-xs font-bold">{meta.symbol}</p>
                  <p className="text-[9px] text-muted-foreground/40">{selectedWallet.network}</p>
                </div>
              </div>

              <Card className="bg-card/20 border-border/15 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center border-b border-border/15">
                    <span className="pl-5 text-2xl font-black text-muted-foreground/20">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      min="1"
                      className="border-0 bg-transparent h-16 text-2xl font-black focus-visible:ring-0 placeholder:text-muted-foreground/15"
                    />
                    <span className="pr-5 text-xs font-bold text-muted-foreground/20 uppercase">USD</span>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {quickAmounts.map(qa => (
                      <button
                        key={qa}
                        onClick={() => setAmount(String(qa))}
                        className={`rounded-lg px-4 py-2 text-[11px] font-bold transition-all ${
                          amount === String(qa)
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-card/40 text-muted-foreground/50 border border-border/15 hover:bg-card/60 hover:text-foreground/80"
                        }`}
                      >
                        ${qa.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full h-13 font-bold rounded-xl shadow-lg shadow-primary/15 text-sm"
                onClick={() => {
                  if (amount && Number(amount) > 0) setStep(3);
                  else toast({ title: "Enter amount", description: "Please enter a valid deposit amount", variant: "destructive" });
                }}
              >
                Continue to Deposit <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Send & Confirm */}
          {step === 3 && selectedWallet && meta && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Send & Confirm</Label>
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline">
                  <ChevronLeft className="h-3 w-3" /> Change Amount
                </button>
              </div>

              {/* Summary card */}
              <Card className="overflow-hidden border-primary/15" style={{ background: `linear-gradient(135deg, ${meta.color}08, transparent)` }}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-muted-foreground/40 font-medium uppercase tracking-wider">Depositing</p>
                      <p className="text-3xl font-black text-primary mt-1">${Number(amount).toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground/50 mt-1">via {selectedWallet.network}</p>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${meta.bgClass} ${meta.borderClass} border`}>
                      {meta.logoSvg}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet address */}
              <Card className="bg-card/20 border-border/15">
                <CardContent className="p-5">
                  <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">
                    Send exactly ${Number(amount).toLocaleString()} in {meta.symbol} to this address:
                  </Label>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="flex-1 break-all rounded-xl bg-background/60 p-4 text-[11px] font-mono text-foreground/70 border border-border/15 leading-relaxed">
                      {selectedWallet.wallet_address}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyAddress} className="shrink-0 h-12 w-12 rounded-xl border-border/20 hover:bg-primary/10 hover:border-primary/20">
                      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {copied && <p className="text-[10px] text-success font-semibold mt-2">✓ Address copied to clipboard</p>}
                </CardContent>
              </Card>

              {/* Warning */}
              <div className="flex items-start gap-3 rounded-xl border border-destructive/15 bg-destructive/[0.03] p-4">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                  Only send <span className="font-bold text-foreground/80">{meta.symbol} ({selectedWallet.network})</span> to this address. Sending other tokens or using the wrong network will result in permanent loss of funds.
                </p>
              </div>

              <Button
                className="w-full h-14 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all text-sm"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "I've Sent the Payment — Confirm Deposit"}
              </Button>

              <p className="text-center text-[10px] text-muted-foreground/30">
                Your deposit will be verified and credited to your balance within 24 hours
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/10 border-border/10">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-3.5 w-3.5 text-primary/60" />
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">How Deposits Work</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Select your preferred cryptocurrency network",
                  "Enter the amount you wish to deposit in USD",
                  "Copy the wallet address and send crypto from your wallet",
                  "Confirm the deposit and wait for admin verification",
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2 rounded-xl bg-background/30 border border-border/10 p-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">{i + 1}</span>
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
