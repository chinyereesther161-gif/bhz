import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Package, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Settings, Bell, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/trading", icon: BarChart3, label: "Trading" },
  { to: "/packages", icon: Package, label: "Packages" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/deposit", icon: ArrowDownToLine, label: "Deposit" },
  { to: "/withdraw", icon: ArrowUpFromLine, label: "Withdraw" },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg">
        <span className="text-lg font-extrabold">
          <span className="text-primary">Capvest</span> AI
        </span>
        <div className="flex items-center gap-2">
          <NavLink to="/notifications" className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className="rounded-lg p-2 text-primary hover:text-primary/80">
              <Shield className="h-5 w-5" />
            </NavLink>
          )}
          <NavLink to="/settings" className="rounded-lg p-2 text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </NavLink>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
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
