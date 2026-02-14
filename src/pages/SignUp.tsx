import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Users, Shield, TrendingUp } from "lucide-react";
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
      toast({ title: "Welcome to Capvest AI! 🎉", description: "Your account has been created. Enjoy your $10 welcome bonus!" });
      navigate("/dashboard");
    } else {
      toast({ title: "Account created!", description: "You can now sign in with your credentials." });
      navigate("/signin");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[200px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative text-center px-12 max-w-md">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground text-2xl mb-8 shadow-2xl shadow-primary/20">C</div>
          <h2 className="text-3xl font-black mb-4">Join 12,400+ Traders</h2>
          <p className="text-muted-foreground/60 leading-relaxed">
            Create your account and let our institutional-grade AI start growing your portfolio today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/40">
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary/40" /> 12,400+ active</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-primary/40" /> Fully secured</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-success/40" /> Weekly payouts</span>
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-10 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground text-sm shadow-lg shadow-primary/20">C</div>
              <span className="text-lg font-bold tracking-tight"><span className="text-primary">Capvest</span> <span className="text-foreground/60">AI</span></span>
            </Link>
            <h1 className="text-2xl font-black">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground/50">Start your AI trading journey</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="h-12 bg-card/20 border-border/20 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-card/20 border-border/20 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-12 bg-card/20 border-border/20 rounded-xl pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm Password</Label>
              <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="h-12 bg-card/20 border-border/20 rounded-xl" />
            </div>
            <Button type="submit" className="w-full h-12 gap-2 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all" disabled={loading}>
              {loading ? "Creating account..." : "Get Started"} <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground/40 pt-2">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
