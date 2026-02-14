import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Package, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Settings, Bell, Shield, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/trading", icon: BarChart3, label: "Trading" },
  { to: "/packages", icon: Package, label: "Plans" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Portfolio" },
  { to: "/deposit", icon: ArrowDownToLine, label: "Deposit" },
  { to: "/withdraw", icon: ArrowUpFromLine, label: "Withdraw" },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-2xl">
        <div className="flex h-14 items-center justify-between px-4 max-w-lg mx-auto">
          <span className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground text-xs shadow-md shadow-primary/15">C</div>
            <span className="text-sm font-bold tracking-tight">
              <span className="text-primary">Capvest</span>{" "}
              <span className="text-foreground/60">AI</span>
            </span>
          </span>
          <div className="flex items-center gap-0.5">
            <NavLink to="/history" className={({ isActive }) => `rounded-xl p-2.5 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:text-foreground hover:bg-card/50"}`}>
              <History className="h-[18px] w-[18px]" />
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `relative rounded-xl p-2.5 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:text-foreground hover:bg-card/50"}`}>
              <Bell className="h-[18px] w-[18px]" />
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="rounded-xl p-2.5 text-primary/70 hover:text-primary hover:bg-primary/10 transition-all">
                <Shield className="h-[18px] w-[18px]" />
              </NavLink>
            )}
            <NavLink to="/settings" className={({ isActive }) => `rounded-xl p-2.5 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:text-foreground hover:bg-card/50"}`}>
              <Settings className="h-[18px] w-[18px]" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-semibold transition-all duration-300 ${
                  active ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground/70"
                }`}
              >
                <div className={`p-1 rounded-lg transition-all ${active ? "bg-primary/10 shadow-sm shadow-primary/10" : ""}`}>
                  <item.icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_8px_hsl(43,100%,50%,0.3)]" : ""}`} />
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
