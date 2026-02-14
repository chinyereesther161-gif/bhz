import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Search, Ban, UserCheck, Edit2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Profile = Tables<"profiles">;

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [editPnl, setEditPnl] = useState("");
  const [editPlan, setEditPlan] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.capvest_id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBan = async (user: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update({ banned: !user.banned })
      .eq("user_id", user.user_id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: user.banned ? "User unbanned" : "User banned" });
      fetchUsers();
    }
  };

  const openEdit = (user: Profile) => {
    setEditUser(user);
    setEditBalance(String(user.balance));
    setEditPnl(String(user.weekly_pnl));
    setEditPlan(user.active_plan || "");
  };

  const saveEdit = async () => {
    if (!editUser) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        balance: Number(editBalance),
        weekly_pnl: Number(editPnl),
        active_plan: editPlan || null,
      })
      .eq("user_id", editUser.user_id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "User updated" });
      setEditUser(null);
      fetchUsers();
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map(user => (
              <Card key={user.id} className={user.banned ? "border-destructive/30" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{user.name || "No Name"}</p>
                        {user.banned && <Badge variant="destructive" className="text-xs">Banned</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.capvest_id}</p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <span>Balance: <span className="text-primary font-medium">${user.balance}</span></span>
                        <span>P&L: <span className={Number(user.weekly_pnl) >= 0 ? "text-success" : "text-destructive"}>${user.weekly_pnl}</span></span>
                        <span>Plan: {user.active_plan || "None"}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleBan(user)}>
                        {user.banned ? <UserCheck className="h-4 w-4 text-success" /> : <Ban className="h-4 w-4 text-destructive" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit {editUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Balance</Label>
              <Input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Weekly P&L</Label>
              <Input type="number" value={editPnl} onChange={e => setEditPnl(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Active Plan</Label>
              <Input value={editPlan} onChange={e => setEditPlan(e.target.value)} placeholder="e.g. Gold" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AdminUsers;
