import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        <h1 className="text-xl font-black">Deposit Funds</h1>

        {/* Network Selector */}
        <div className="grid grid-cols-4 gap-2">
          {networks.map(n => (
            <button
              key={n.id}
              onClick={() => setSelectedNetwork(n)}
              className={`rounded-xl border p-3 text-center transition-all ${
                selectedNetwork.id === n.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/40 bg-card/30 text-muted-foreground hover:border-primary/20"
              }`}
            >
              <span className="block text-lg font-bold">{n.icon}</span>
              <span className="block text-[10px] font-medium mt-1">{n.name}</span>
            </button>
          ))}
        </div>

        {/* Wallet Address */}
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Send {selectedNetwork.name} to:
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 break-all rounded-lg bg-secondary/50 p-3 text-[11px] font-mono text-foreground/80 border border-border/30">
                {selectedNetwork.address}
              </code>
              <Button variant="outline" size="icon" onClick={copyAddress} className="shrink-0 h-10 w-10">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="amount" className="text-xs font-medium">Deposit Amount (USD)</Label>
          <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} min="1" className="h-11 bg-card/50 border-border/60" />
        </div>

        <Button className="w-full h-12 font-bold" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Deposit"}
        </Button>

        {/* Instructions */}
        <Card className="bg-card/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold">How to Deposit</h3>
            </div>
            <ol className="space-y-2">
              {[
                "Select your preferred network above",
                "Copy the wallet address",
                "Send the exact amount from your wallet",
                "Enter the amount and submit the form",
                "Wait for verification (usually within 24h)",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[11px] text-muted-foreground">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Only send {selectedNetwork.name} to this address. Sending any other cryptocurrency may result in permanent loss of funds.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Deposit;
