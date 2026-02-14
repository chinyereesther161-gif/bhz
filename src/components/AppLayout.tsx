import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Package, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Settings, Bell, Shield, History, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Portfolio" },
  { to: "/markets", icon: Globe, label: "Markets" },
  { to: "/trading", icon: BarChart3, label: "Trading" },
  { to: "/packages", icon: Package, label: "Invest" },
  { to: "/deposit", icon: ArrowDownToLine, label: "Deposit" },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/20 bg-background/85 backdrop-blur-2xl">
        <div className="flex h-14 items-center justify-between px-4 max-w-lg mx-auto">
          <span className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/80 shadow-md shadow-primary/15" />
              <span className="relative font-black text-primary-foreground text-[10px]">CV</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-black tracking-tight">CAPVEST</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-primary/70">AI Trading</span>
            </div>
          </span>
          <div className="flex items-center gap-0.5">
            <NavLink to="/history" className={({ isActive }) => `rounded-xl p-2 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-foreground hover:bg-card/50"}`}>
              <History className="h-[17px] w-[17px]" />
            </NavLink>
            <NavLink to="/withdraw" className={({ isActive }) => `rounded-xl p-2 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-foreground hover:bg-card/50"}`}>
              <ArrowUpFromLine className="h-[17px] w-[17px]" />
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `rounded-xl p-2 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-foreground hover:bg-card/50"}`}>
              <Bell className="h-[17px] w-[17px]" />
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="rounded-xl p-2 text-primary/60 hover:text-primary hover:bg-primary/10 transition-all">
                <Shield className="h-[17px] w-[17px]" />
              </NavLink>
            )}
            <NavLink to="/settings" className={({ isActive }) => `rounded-xl p-2 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-foreground hover:bg-card/50"}`}>
              <Settings className="h-[17px] w-[17px]" />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-24">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/20 bg-background/92 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1.5">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[9px] font-semibold transition-all ${
                  active ? "text-primary" : "text-muted-foreground/35 hover:text-muted-foreground/60"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${active ? "bg-primary/10" : ""}`}>
                  <item.icon className={`h-[18px] w-[18px] ${active ? "drop-shadow-[0_0_6px_hsl(43,100%,50%,0.3)]" : ""}`} />
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
