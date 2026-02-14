import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const networks = [
  { id: "usdt-trc20", name: "USDT TRC20", address: "TJYk7aBcZn3xF9dR2vEqPmN8wL5sKh4Uy6" },
  { id: "btc", name: "Bitcoin (BTC)", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { id: "eth", name: "Ethereum (ETH)", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
  { id: "sol", name: "Solana (SOL)", address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" },
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
      toast({ title: "Deposit submitted", description: "Your deposit is pending verification." });
      setAmount("");
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">Deposit Funds</h1>

        {/* Network Selector */}
        <div className="flex flex-wrap gap-2">
          {networks.map(n => (
            <Badge
              key={n.id}
              variant={selectedNetwork.id === n.id ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setSelectedNetwork(n)}
            >
              {n.name}
            </Badge>
          ))}
        </div>

        {/* Wallet Address */}
        <Card>
          <CardContent className="p-5">
            <Label className="text-xs text-muted-foreground">Send {selectedNetwork.name} to this address:</Label>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 break-all rounded bg-secondary/50 p-3 text-xs">{selectedNetwork.address}</code>
              <Button variant="outline" size="icon" onClick={copyAddress}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Deposit Amount (USD)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
          />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Deposit"}
        </Button>

        {/* Instructions */}
        <Card>
          <CardContent className="p-5 space-y-2">
            <h3 className="text-sm font-bold">Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
              <li>Select your preferred network above</li>
              <li>Copy the wallet address</li>
              <li>Send the exact amount from your wallet</li>
              <li>Enter the amount and submit</li>
              <li>Wait for admin verification (usually within 24h)</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Deposit;
