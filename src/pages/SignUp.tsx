import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Users, Shield, TrendingUp, BarChart3, Lock, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else if (data.session) {
      toast({ title: "Welcome to Capvest AI!", description: "Your account has been created. Enjoy your $10 welcome bonus!" });
      navigate("/dashboard");
    } else {
      toast({ title: "Account created!", description: "You can now sign in with your credentials." });
      navigate("/signin");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 hero-grid opacity-20" />
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[200px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative text-center px-12 max-w-lg">
          <div className="relative mx-auto mb-10">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/25">
              <span className="font-black text-primary-foreground text-3xl">CV</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-16 rounded-full bg-primary/10 blur-md" />
          </div>
          <h2 className="text-3xl font-black mb-3 tracking-tight">Start Your Trading Journey</h2>
          <p className="text-muted-foreground/50 leading-relaxed text-sm">
            Join thousands of traders using our professional trading engine to grow their portfolios with institutional strategies.
          </p>

          {/* Benefits */}
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {[
              { icon: Gift, text: "$10 welcome bonus on sign up", color: "text-primary" },
              { icon: BarChart3, text: "Professional trading terminal access", color: "text-success" },
              { icon: Shield, text: "Bank-grade security and encryption", color: "text-purple-400" },
              { icon: TrendingUp, text: "Weekly profit distributions", color: "text-primary" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3 rounded-xl border border-border/10 bg-card/15 p-3">
                <b.icon className={`h-4 w-4 ${b.color} shrink-0`} />
                <span className="text-[11px] text-muted-foreground/50">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground/30">
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> 12,400+ traders</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Fully encrypted</span>
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center px-5 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 lg:hidden">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <span className="font-black text-primary-foreground text-sm">CV</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight">CAPVEST</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary/60">AI Trading</span>
              </div>
            </Link>
            <h1 className="text-2xl font-black tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground/40">Start trading in under 2 minutes</p>
          </div>

          {/* Welcome bonus banner — mobile */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] p-3 lg:hidden">
            <Gift className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-primary">$10 Welcome Bonus</p>
              <p className="text-[9px] text-muted-foreground/40">Credited instantly on registration</p>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl pr-11 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Confirm Password</Label>
              <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl text-sm" />
            </div>
            <Button type="submit" className="w-full h-12 gap-2 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/15" />
            <span className="text-[9px] text-muted-foreground/20 font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border/15" />
          </div>

          <p className="text-center text-xs text-muted-foreground/35">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>

          {/* Mobile trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[9px] text-muted-foreground/25 lg:hidden">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secured</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 12,400+</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Weekly</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;