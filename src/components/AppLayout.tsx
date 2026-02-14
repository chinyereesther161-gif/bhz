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
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 max-w-lg mx-auto">
          <span className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-black text-primary-foreground text-xs">C</div>
            <span className="text-sm font-bold">
              <span className="text-primary">Capvest</span> AI
            </span>
          </span>
          <div className="flex items-center gap-1">
            <NavLink to="/history" className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
              <History className="h-4.5 w-4.5" />
            </NavLink>
            <NavLink to="/notifications" className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4.5 w-4.5" />
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="rounded-lg p-2 text-primary hover:text-primary/80 transition-colors">
                <Shield className="h-4.5 w-4.5" />
              </NavLink>
            )}
            <NavLink to="/settings" className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-4.5 w-4.5" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1.5">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_6px_hsl(45,100%,51%,0.4)]" : ""}`} />
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
