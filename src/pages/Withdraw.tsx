import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const networks = ["USDT TRC20", "Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)"];

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
      toast({ title: "Minimum $50", description: "Minimum withdrawal amount is $50.", variant: "destructive" });
      return;
    }
    if (numAmount > (profile?.balance ?? 0)) {
      toast({ title: "Insufficient balance", description: "You don't have enough funds.", variant: "destructive" });
      return;
    }
    if (!walletAddress.trim()) {
      toast({ title: "Error", description: "Please enter your wallet address.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id,
      amount: numAmount,
      network,
      wallet_address: walletAddress.trim(),
      email: email.trim(),
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Withdrawal submitted", description: "Your request is being processed." });
      setAmount("");
      setWalletAddress("");
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Withdraw Funds</h1>
          <p className="text-sm text-muted-foreground">
            Available: <span className="text-primary font-semibold">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Network</Label>
              <div className="flex flex-wrap gap-2">
                {networks.map(n => (
                  <Badge
                    key={n}
                    variant={network === n ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5"
                    onClick={() => setNetwork(n)}
                  >
                    {n}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input id="wallet" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Enter your wallet address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD) — Min $50</Label>
              <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50" min="50" />
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Withdrawal"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Withdraw;
