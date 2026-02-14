import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Package, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Settings, Bell, Shield, History, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SupportDialog from "@/components/SupportDialog";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Portfolio" },
  { to: "/markets", icon: Globe, label: "Markets" },
  { to: "/trading", icon: BarChart3, label: "Trading" },
  { to: "/packages", icon: Package, label: "Invest" },
  { to: "/deposit", icon: ArrowDownToLine, label: "Deposit" },
  { to: "/withdraw", icon: ArrowUpFromLine, label: "Withdraw" },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .or(`user_id.eq.${user.id},is_broadcast.eq.true`)
        .eq("is_read", false);
      setUnreadCount(count ?? 0);
    };
    fetchUnread();

    const channel = supabase
      .channel("notif-badge")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchUnread())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

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
            <NavLink to="/notifications" className={({ isActive }) => `relative rounded-xl p-2 transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-foreground hover:bg-card/50"}`}>
              <Bell className="h-[17px] w-[17px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
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
      <SupportDialog />

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/20 bg-background/92 backdrop-blur-2xl safe-area-bottom">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1 px-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 text-[8px] font-semibold transition-all min-w-0 ${
                  active ? "text-primary" : "text-muted-foreground/35 hover:text-muted-foreground/60"
                }`}
              >
                <div className={`p-1 rounded-lg transition-all ${active ? "bg-primary/10" : ""}`}>
                  <item.icon className={`h-[17px] w-[17px] ${active ? "drop-shadow-[0_0_6px_hsl(43,100%,50%,0.3)]" : ""}`} />
                </div>
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
