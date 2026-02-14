import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Shield, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const networks = [
  { id: "usdt-trc20", name: "USDT TRC20", address: "TJYk7aBcZn3xF9dR2vEqPmN8wL5sKh4Uy6", icon: "₮" },
  { id: "btc", name: "Bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", icon: "₿" },
  { id: "eth", name: "Ethereum", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", icon: "Ξ" },
  { id: "sol", name: "Solana", address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", icon: "◎" },
];

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedNetwork.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!user || !amount || Number(amount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("deposits").insert({
      user_id: user.id,
      amount: Number(amount),
      network: selectedNetwork.name,
      wallet_address: selectedNetwork.address,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deposit submitted", description: "Pending verification — usually within 24h." });
      setAmount("");
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-black">Deposit Funds</h1>
        </motion.div>

        {/* Network Selector */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-2.5">
          {networks.map(n => (
            <button
              key={n.id}
              onClick={() => setSelectedNetwork(n)}
              className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
                selectedNetwork.id === n.id
                  ? "border-primary/30 bg-primary/[0.06] text-primary shadow-md shadow-primary/10"
                  : "border-border/15 bg-card/15 text-muted-foreground/50 hover:border-primary/15 hover:bg-card/30"
              }`}
            >
              <span className="block text-xl font-bold">{n.icon}</span>
              <span className="block text-[9px] font-semibold mt-1.5 uppercase tracking-wider">{n.name.split(' ')[0]}</span>
            </button>
          ))}
        </motion.div>

        {/* Wallet Address */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/20 border-border/15">
            <CardContent className="p-5">
              <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">
                Send {selectedNetwork.name} to:
              </Label>
              <div className="mt-3 flex items-center gap-2.5">
                <code className="flex-1 break-all rounded-xl bg-secondary/30 p-3.5 text-[11px] font-mono text-foreground/70 border border-border/15">
                  {selectedNetwork.address}
                </code>
                <Button variant="outline" size="icon" onClick={copyAddress} className="shrink-0 h-11 w-11 rounded-xl border-border/20 hover:bg-primary/10 hover:border-primary/20 transition-all">
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amount */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
          <Label htmlFor="amount" className="text-xs font-semibold">Deposit Amount (USD)</Label>
          <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} min="1" className="h-12 bg-card/20 border-border/20 rounded-xl text-sm" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Button className="w-full h-13 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Deposit"}
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card/10 border-border/15">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary/70" />
                <h3 className="text-xs font-bold">How to Deposit</h3>
              </div>
              <ol className="space-y-2.5">
                {[
                  "Select your preferred network above",
                  "Copy the wallet address",
                  "Send the exact amount from your wallet",
                  "Enter the amount and submit the form",
                  "Wait for verification (usually within 24h)",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-[11px] text-muted-foreground/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-[9px] font-bold text-primary mt-0.5 border border-primary/10">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
            <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
              Only send <span className="font-semibold text-muted-foreground/80">{selectedNetwork.name}</span> to this address. Sending any other cryptocurrency may result in permanent loss of funds.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Deposit;
