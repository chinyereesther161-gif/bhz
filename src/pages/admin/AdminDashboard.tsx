import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, ArrowDownToLine, ArrowUpFromLine, Bell, Settings, UserCheck, ChevronRight } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, pendingDeposits: 0, pendingWithdrawals: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [profiles, deposits, withdrawals] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("deposits").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("withdrawals").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        users: profiles.count ?? 0,
        pendingDeposits: deposits.count ?? 0,
        pendingWithdrawals: withdrawals.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const links = [
    { to: "/admin/users", icon: Users, label: "User Management", desc: "Search, edit, ban users" },
    { to: "/admin/deposits", icon: ArrowDownToLine, label: "Deposit Verification", desc: "Approve/reject deposits" },
    { to: "/admin/withdrawals", icon: ArrowUpFromLine, label: "Withdrawal Processing", desc: "Process withdrawal requests" },
    { to: "/admin/notifications", icon: Bell, label: "Broadcast Notifications", desc: "Send notifications to users" },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Badge className="bg-primary/20 text-primary">Admin</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="mx-auto h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">{stats.users}</p>
              <p className="text-xs text-muted-foreground">Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ArrowDownToLine className="mx-auto h-5 w-5 text-success mb-1" />
              <p className="text-2xl font-bold">{stats.pendingDeposits}</p>
              <p className="text-xs text-muted-foreground">Pending Dep.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ArrowUpFromLine className="mx-auto h-5 w-5 text-destructive mb-1" />
              <p className="text-2xl font-bold">{stats.pendingWithdrawals}</p>
              <p className="text-xs text-muted-foreground">Pending Wit.</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          {links.map(link => (
            <Link key={link.to} to={link.to}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
