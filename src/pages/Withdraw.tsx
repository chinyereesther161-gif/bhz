import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const networks = [
  { id: "usdt", name: "USDT TRC20", icon: "₮" },
  { id: "btc", name: "Bitcoin", icon: "₿" },
  { id: "eth", name: "Ethereum", icon: "Ξ" },
  { id: "sol", name: "Solana", icon: "◎" },
];

const Withdraw = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [network, setNetwork] = useState(networks[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState(profile?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    const numAmount = Number(amount);
    if (numAmount < 50) {
      toast({ title: "Minimum $50", description: "Minimum withdrawal is $50.", variant: "destructive" });
      return;
    }
    if (numAmount > (profile?.balance ?? 0)) {
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
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-black">Withdraw</h1>
          <p className="text-xs text-muted-foreground/60">
            Available: <span className="text-primary font-bold">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </motion.div>

        {/* Network selector */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-2.5">
          {networks.map(n => (
            <button
              key={n.id}
              onClick={() => setNetwork(n)}
              className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
                network.id === n.id
                  ? "border-primary/30 bg-primary/[0.06] text-primary shadow-md shadow-primary/10"
                  : "border-border/15 bg-card/15 text-muted-foreground/50 hover:border-primary/15 hover:bg-card/30"
              }`}
            >
              <span className="block text-xl font-bold">{n.icon}</span>
              <span className="block text-[9px] font-semibold mt-1.5 uppercase tracking-wider">{n.name.split(' ')[0]}</span>
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/20 border-border/15">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="h-11 bg-secondary/20 border-border/15 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Wallet Address</Label>
                <Input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Enter your wallet address" className="h-11 bg-secondary/20 border-border/15 rounded-xl font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Amount (USD) — Min $50</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50" min="50" className="h-11 bg-secondary/20 border-border/15 rounded-xl" />
              </div>
              <Button className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/15" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Withdrawal"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-3">
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
