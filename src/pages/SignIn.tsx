import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Shield, TrendingUp, Zap, BarChart3, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 hero-grid opacity-20" />
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[200px]" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-success/[0.02] blur-[180px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative text-center px-12 max-w-lg">
          <div className="relative mx-auto mb-10">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/25">
              <span className="font-black text-primary-foreground text-3xl">CV</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-16 rounded-full bg-primary/10 blur-md" />
          </div>
          <h2 className="text-3xl font-black mb-3 tracking-tight">Institutional Grade Trading</h2>
          <p className="text-muted-foreground/50 leading-relaxed text-sm">
            Access professional portfolio management tools and let our trading engine optimize your returns across multiple markets.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "94.7%", label: "Win Rate", icon: TrendingUp },
              { value: "$2.4M+", label: "Volume", icon: BarChart3 },
              { value: "12,400+", label: "Traders", icon: Shield },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border/10 bg-card/20 p-3.5 text-center">
                <s.icon className="h-4 w-4 text-primary/40 mx-auto mb-2" />
                <p className="text-lg font-black text-gradient-gold">{s.value}</p>
                <p className="text-[9px] text-muted-foreground/30 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground/30">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> End-to-end encrypted</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Instant execution</span>
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 lg:hidden">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <span className="font-black text-primary-foreground text-sm">CV</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight">CAPVEST</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary/60">AI Trading</span>
              </div>
            </Link>
            <h1 className="text-2xl font-black tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground/40">Sign in to your trading account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-card/20 border-border/20 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-12 bg-card/20 border-border/20 rounded-xl pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 gap-2 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/15" />
            <span className="text-[9px] text-muted-foreground/20 font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border/15" />
          </div>

          <p className="text-center text-xs text-muted-foreground/35">
            New to Capvest?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>

          {/* Mobile trust badges */}
          <div className="mt-8 flex items-center justify-center gap-5 text-[9px] text-muted-foreground/25 lg:hidden">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secured</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> 94.7% Win</span>
            <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Instant</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;