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
        <div>
          <h1 className="text-xl font-black">Withdraw</h1>
          <p className="text-xs text-muted-foreground">
            Available: <span className="text-primary font-bold">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        {/* Network selector */}
        <div className="grid grid-cols-4 gap-2">
          {networks.map(n => (
            <button
              key={n.id}
              onClick={() => setNetwork(n)}
              className={`rounded-xl border p-3 text-center transition-all ${
                network.id === n.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/40 bg-card/30 text-muted-foreground hover:border-primary/20"
              }`}
            >
              <span className="block text-lg font-bold">{n.icon}</span>
              <span className="block text-[10px] font-medium mt-1">{n.name}</span>
            </button>
          ))}
        </div>

        <Card className="bg-card/50">
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="h-11 bg-secondary/30 border-border/40" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Wallet Address</Label>
              <Input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Enter your wallet address" className="h-11 bg-secondary/30 border-border/40 font-mono text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Amount (USD) — Min $50</Label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50" min="50" className="h-11 bg-secondary/30 border-border/40" />
            </div>

            <Button className="w-full h-12 font-bold" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Withdrawal"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/30 p-3">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] font-bold">Secure</p>
              <p className="text-[9px] text-muted-foreground">256-bit encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/30 p-3">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] font-bold">Fast</p>
              <p className="text-[9px] text-muted-foreground">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Withdraw;
