import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Users, Shield, TrendingUp, BarChart3, Lock, Gift, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const countryCodes = [
  { code: "+1", country: "US/CA" }, { code: "+44", country: "UK" }, { code: "+91", country: "IN" },
  { code: "+86", country: "CN" }, { code: "+81", country: "JP" }, { code: "+49", country: "DE" },
  { code: "+33", country: "FR" }, { code: "+61", country: "AU" }, { code: "+55", country: "BR" },
  { code: "+234", country: "NG" }, { code: "+254", country: "KE" }, { code: "+27", country: "ZA" },
  { code: "+971", country: "AE" }, { code: "+966", country: "SA" }, { code: "+92", country: "PK" },
  { code: "+880", country: "BD" }, { code: "+62", country: "ID" }, { code: "+63", country: "PH" },
  { code: "+84", country: "VN" }, { code: "+66", country: "TH" }, { code: "+82", country: "KR" },
  { code: "+39", country: "IT" }, { code: "+34", country: "ES" }, { code: "+31", country: "NL" },
  { code: "+46", country: "SE" }, { code: "+47", country: "NO" }, { code: "+48", country: "PL" },
  { code: "+7", country: "RU" }, { code: "+90", country: "TR" }, { code: "+20", country: "EG" },
  { code: "+233", country: "GH" }, { code: "+255", country: "TZ" }, { code: "+256", country: "UG" },
  { code: "+237", country: "CM" }, { code: "+225", country: "CI" }, { code: "+221", country: "SN" },
  { code: "+213", country: "DZ" }, { code: "+212", country: "MA" }, { code: "+216", country: "TN" },
  { code: "+251", country: "ET" }, { code: "+260", country: "ZM" }, { code: "+263", country: "ZW" },
  { code: "+52", country: "MX" }, { code: "+57", country: "CO" }, { code: "+56", country: "CL" },
  { code: "+54", country: "AR" }, { code: "+51", country: "PE" }, { code: "+58", country: "VE" },
  { code: "+60", country: "MY" }, { code: "+65", country: "SG" }, { code: "+852", country: "HK" },
  { code: "+886", country: "TW" }, { code: "+94", country: "LK" }, { code: "+977", country: "NP" },
  { code: "+95", country: "MM" }, { code: "+964", country: "IQ" }, { code: "+98", country: "IR" },
  { code: "+972", country: "IL" }, { code: "+962", country: "JO" }, { code: "+961", country: "LB" },
  { code: "+974", country: "QA" }, { code: "+968", country: "OM" }, { code: "+973", country: "BH" },
  { code: "+965", country: "KW" }, { code: "+993", country: "TM" }, { code: "+998", country: "UZ" },
  { code: "+380", country: "UA" }, { code: "+40", country: "RO" }, { code: "+36", country: "HU" },
  { code: "+420", country: "CZ" }, { code: "+43", country: "AT" }, { code: "+41", country: "CH" },
  { code: "+32", country: "BE" }, { code: "+353", country: "IE" }, { code: "+351", country: "PT" },
  { code: "+30", country: "GR" }, { code: "+358", country: "FI" }, { code: "+45", country: "DK" },
  { code: "+64", country: "NZ" }, { code: "+675", country: "PG" }, { code: "+679", country: "FJ" },
].sort((a, b) => a.country.localeCompare(b.country));

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

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
    setCreatingAccount(true);

    const fullPhone = phoneNumber ? `${countryCode}${phoneNumber}` : "";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: fullPhone,
          referred_by: referralCode || undefined,
        },
      },
    });

    await new Promise(resolve => setTimeout(resolve, 4000));

    setLoading(false);
    setCreatingAccount(false);

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
      {/* Loading overlay */}
      {creatingAccount && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/25">
                <span className="font-black text-primary-foreground text-3xl">CV</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-lg font-black">Creating Your Account</h2>
              <p className="text-sm text-muted-foreground">Setting up your trading environment...</p>
            </div>
            <div className="flex flex-col items-center gap-2 mt-4">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-muted-foreground flex items-center gap-2">
                <Shield className="h-3 w-3 text-success" /> Securing your account
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-xs text-muted-foreground flex items-center gap-2">
                <Gift className="h-3 w-3 text-primary" /> Adding $10 welcome bonus
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-xs text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-success" /> Connecting to AI engine
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}

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
          <p className="text-muted-foreground leading-relaxed text-sm">
            Join thousands of traders using our professional trading engine to grow their portfolios with institutional strategies.
          </p>

          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {[
              { icon: Gift, text: "$10 welcome bonus on sign up", color: "text-primary" },
              { icon: BarChart3, text: "Professional trading terminal access", color: "text-success" },
              { icon: Shield, text: "Bank-grade security and encryption", color: "text-purple-400" },
              { icon: TrendingUp, text: "Weekly profit distributions", color: "text-primary" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3 rounded-xl border border-border/10 bg-card/15 p-3">
                <b.icon className={`h-4 w-4 ${b.color} shrink-0`} />
                <span className="text-xs text-muted-foreground">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> 12,400+ traders</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Fully encrypted</span>
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center px-5 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
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
            <p className="mt-2 text-sm text-muted-foreground">Start trading in under 2 minutes</p>
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] p-3 lg:hidden">
            <Gift className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-primary">$10 Welcome Bonus</p>
              <p className="text-[9px] text-muted-foreground">Credited instantly on registration</p>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
              <div className="flex gap-2">
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                  className="h-11 w-28 rounded-xl bg-card/20 border border-border/20 px-2 text-xs font-mono text-foreground">
                  {countryCodes.map(c => (
                    <option key={c.code + c.country} value={c.code}>{c.country} {c.code}</option>
                  ))}
                </select>
                <Input id="phone" type="tel" placeholder="Phone number" value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="h-11 flex-1 bg-card/20 border-border/20 rounded-xl text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl pr-11 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
              <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="h-11 bg-card/20 border-border/20 rounded-xl text-sm" />
            </div>

            {referralCode && (
              <div className="flex items-center gap-2 rounded-xl border border-success/15 bg-success/[0.04] p-2.5">
                <Gift className="h-4 w-4 text-success shrink-0" />
                <p className="text-[10px] text-success font-semibold">Referred by: {referralCode}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-12 gap-2 font-bold rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all" disabled={loading}>
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>) : (<>Create Account <ArrowRight className="h-4 w-4" /></>)}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/15" />
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border/15" />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-5 text-[9px] text-muted-foreground lg:hidden">
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
