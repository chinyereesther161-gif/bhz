import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertTriangle, Wallet, ArrowRight, Shield, Clock, Zap, ChevronLeft, Sparkles, BadgeCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const networkMeta: Record<string, { name: string; symbol: string; color: string; logoSvg: React.ReactNode }> = {
  "USDT TRC20": {
    name: "Tether", symbol: "USDT", color: "#26A17B",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-9 w-9">
        <circle cx="16" cy="16" r="16" fill="#26A17B"/>
        <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" fill="#fff"/>
      </svg>
    ),
  },
  "BTC": {
    name: "Bitcoin", symbol: "BTC", color: "#F7931A",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-9 w-9">
        <circle cx="16" cy="16" r="16" fill="#F7931A"/>
        <path d="M22.5 14.13c.31-2.1-1.28-3.22-3.46-3.97l.71-2.83-1.73-.43-.69 2.76c-.45-.11-.92-.22-1.38-.32l.69-2.78-1.72-.43-.7 2.83c-.38-.09-.74-.17-1.1-.26l-2.38-.59-.46 1.85s1.28.29 1.25.31c.7.18.83.63.81 1l-.81 3.26c.05.01.11.03.18.06l-.18-.05-1.14 4.57c-.09.21-.3.53-.79.41.02.02-1.25-.31-1.25-.31l-.86 1.98 2.25.56c.42.1.83.21 1.23.31l-.71 2.86 1.72.43.71-2.84c.47.13.93.25 1.38.36l-.7 2.82 1.73.43.71-2.85c2.91.55 5.1.33 6.02-2.31.74-2.12-.04-3.34-1.57-4.14 1.12-.26 1.96-1 2.18-2.52zm-3.9 5.47c-.53 2.12-4.08.97-5.24.69l.94-3.75c1.16.29 4.86.86 4.3 3.06zm.53-5.5c-.48 1.93-3.44.95-4.4.71l.85-3.4c.96.24 4.06.69 3.55 2.69z" fill="#fff"/>
      </svg>
    ),
  },
  "SOL": {
    name: "Solana", symbol: "SOL", color: "#9945FF",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-9 w-9">
        <circle cx="16" cy="16" r="16" fill="#9945FF"/>
        <path d="M9.5 20.5l2.1-2.1c.1-.1.3-.2.5-.2h11.4c.3 0 .5.4.3.6l-2.1 2.1c-.1.1-.3.2-.5.2H9.8c-.3 0-.5-.4-.3-.6zm2.1-7.3c.1-.1.3-.2.5-.2h11.4c.3 0 .5.4.3.6l-2.1 2.1c-.1.1-.3.2-.5.2H9.8c-.3 0-.5-.4-.3-.6l2.1-2.1zm9.7-4.4l-2.1 2.1c-.1.1-.3.2-.5.2H7.3c-.3 0-.5-.4-.3-.6l2.1-2.1c.1-.1.3-.2.5-.2h11.4c.3 0 .5.4.3.6z" fill="#fff"/>
      </svg>
    ),
  },
  "ETH": {
    name: "Ethereum", symbol: "ETH", color: "#627EEA",
    logoSvg: (
      <svg viewBox="0 0 32 32" className="h-9 w-9">
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
    supabase.from("user_wallets").select("network, wallet_address").eq("user_id", user.id)
      .then(({ data }) => { if (data && data.length > 0) setWallets(data); });
  }, [user]);

  const meta = selectedWallet ? networkMeta[selectedWallet.network] : null;

  const copyAddress = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!user || !amount || Number(amount) < 50 || !selectedWallet) {
      toast({ title: "Error", description: "Minimum deposit is $50", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("deposits").insert({
      user_id: user.id, amount: Number(amount),
      network: selectedWallet.network, wallet_address: selectedWallet.wallet_address,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deposit Submitted ✓", description: "Pending verification, usually within 24h." });
      setAmount(""); setStep(1); setSelectedWallet(null);
    }
  };

  if (wallets.length === 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md w-full px-4 flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-2">
            <Wallet className="h-8 w-8 text-primary/60" />
          </div>
          <p className="text-sm font-semibold">Loading wallets...</p>
          <p className="text-xs text-muted-foreground/40">If this persists, contact support</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md w-full px-4 space-y-5">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Fund Account</h1>
              <p className="text-[11px] text-muted-foreground/50">Instant crypto deposits • $50 minimum</p>
            </div>
          </div>
        </motion.div>

        {/* Trust Strip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          className="flex items-center justify-between rounded-2xl border border-border/15 bg-card/10 px-4 py-3"
        >
          {[
            { icon: Shield, label: "Encrypted", color: "text-success" },
            { icon: Clock, label: "< 24h Credit", color: "text-primary" },
            { icon: BadgeCheck, label: "On-Chain", color: "text-purple-400" },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-1.5">
              <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
              <span className="text-[10px] font-bold text-muted-foreground/60">{b.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Step Indicator */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <div className="flex items-center gap-1">
            {["Network", "Amount", "Confirm"].map((label, i) => {
              const num = i + 1;
              const active = step === num;
              const done = step > num;
              return (
                <div key={label} className="flex items-center gap-1 flex-1">
                  <button
                    onClick={() => { if (done) setStep(num); }}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold transition-all w-full justify-center ${
                      active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : done ? "bg-success/15 text-success border border-success/20 cursor-pointer"
                      : "bg-card/15 text-muted-foreground/25 border border-border/10"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black shrink-0 ${
                      done ? "bg-success text-white" : active ? "bg-white/20" : "bg-muted/10"
                    }`}>
                      {done ? "✓" : num}
                    </span>
                    {label}
                  </button>
                  {i < 2 && <ArrowRight className="h-3 w-3 text-muted-foreground/10 shrink-0" />}
                </div>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Select Network</p>
              <div className="grid grid-cols-2 gap-3">
                {wallets.map(w => {
                  const m = networkMeta[w.network];
                  if (!m) return null;
                  const sel = selectedWallet?.network === w.network;
                  return (
                    <button
                      key={w.network}
                      onClick={() => { setSelectedWallet(w); setStep(2); }}
                      className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        sel
                          ? "border-primary/30 bg-primary/[0.06] shadow-lg shadow-primary/5"
                          : "border-border/15 bg-card/10 hover:border-border/30 hover:bg-card/25"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-2.5">
                        <div className="rounded-xl p-2" style={{ background: `${m.color}15` }}>
                          {m.logoSvg}
                        </div>
                        <div>
                          <p className="text-sm font-black">{m.symbol}</p>
                          <p className="text-[9px] text-muted-foreground/40 mt-0.5">{m.name}</p>
                        </div>
                      </div>
                      {sel && (
                        <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-muted-foreground/30 text-center px-4 leading-relaxed">
                Only send the correct cryptocurrency to its matching network. Wrong network = permanent loss.
              </p>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && selectedWallet && meta && (
            <motion.div key="s2" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Deposit Amount</p>
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline">
                  <ChevronLeft className="h-3 w-3" /> Change
                </button>
              </div>

              {/* Selected network pill */}
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-border/15 bg-card/15">
                <div className="h-5 w-5" style={{ color: meta.color }}>{meta.logoSvg}</div>
                <span className="text-[10px] font-bold">{meta.symbol}</span>
                <span className="text-[9px] text-muted-foreground/30">{selectedWallet.network}</span>
              </div>

              {/* Amount input */}
              <Card className="bg-card/15 border-border/15 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center px-5 py-5 gap-2">
                    <span className="text-3xl font-black text-muted-foreground/15">$</span>
                    <Input
                      type="number" placeholder="0.00" value={amount}
                      onChange={e => setAmount(e.target.value)} min="50"
                      className="border-0 bg-transparent h-14 text-3xl font-black focus-visible:ring-0 placeholder:text-muted-foreground/10 p-0"
                      autoFocus
                    />
                  </div>
                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {quickAmounts.map(qa => (
                      <button key={qa} onClick={() => setAmount(String(qa))}
                        className={`rounded-lg px-3.5 py-2 text-[11px] font-bold transition-all ${
                          amount === String(qa)
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                            : "bg-card/30 text-muted-foreground/40 border border-border/10 hover:bg-card/50 hover:text-foreground/70"
                        }`}
                      >
                        ${qa.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {Number(amount) > 0 && Number(amount) < 50 && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Minimum deposit is $50
                </p>
              )}

              <Button
                className="w-full h-13 font-bold rounded-xl shadow-lg shadow-primary/10 text-sm"
                onClick={() => {
                  if (amount && Number(amount) >= 50) setStep(3);
                  else toast({ title: "Minimum $50", description: "Please enter at least $50", variant: "destructive" });
                }}
                disabled={!amount || Number(amount) < 50}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && selectedWallet && meta && (
            <motion.div key="s3" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Confirm & Send</p>
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline">
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
              </div>

              {/* Amount summary */}
              <Card className="overflow-hidden glow-border">
                <CardContent className="relative p-0">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-success/[0.02]" />
                  <div className="relative p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">Deposit Amount</p>
                      <p className="text-3xl font-black text-gradient-gold mt-1">${Number(amount).toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground/40 mt-1.5 font-medium">via {selectedWallet.network}</p>
                    </div>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}25` }}>
                      {meta.logoSvg}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet address */}
              <Card className="bg-card/15 border-border/15">
                <CardContent className="p-4 space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/30">
                    Send {meta.symbol} to this address
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 break-all rounded-xl bg-background/50 p-3.5 text-[11px] font-mono text-foreground/70 border border-border/10 leading-relaxed select-all">
                      {selectedWallet.wallet_address}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyAddress}
                      className="shrink-0 h-11 w-11 rounded-xl border-border/15 hover:bg-primary/10 hover:border-primary/20"
                    >
                      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {copied && <p className="text-[10px] text-success font-semibold">✓ Copied to clipboard</p>}
                </CardContent>
              </Card>

              {/* Warning */}
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/10 bg-destructive/[0.03] p-3.5">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                  Only send <span className="font-bold text-foreground/70">{meta.symbol}</span> on the <span className="font-bold text-foreground/70">{selectedWallet.network}</span> network. Wrong network = permanent loss.
                </p>
              </div>

              <Button
                className="w-full h-14 font-bold rounded-xl shadow-lg shadow-primary/10 text-sm"
                onClick={handleSubmit} disabled={loading}
              >
                {loading ? "Submitting..." : "I've Sent · Confirm Deposit"}
              </Button>
              <p className="text-center text-[9px] text-muted-foreground/25">
                Deposits verified & credited within 24 hours
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Deposit;
