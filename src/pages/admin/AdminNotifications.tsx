import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Send, Users, User } from "lucide-react";

type Profile = Tables<"profiles">;

const AdminNotifications = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("profiles").select("*").order("name");
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: "Error", description: "Title and message are required", variant: "destructive" });
      return;
    }
    if (!isBroadcast && !selectedUserId) {
      toast({ title: "Error", description: "Please select a user", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("notifications").insert({
      title: title.trim(),
      message: message.trim(),
      is_broadcast: isBroadcast,
      user_id: isBroadcast ? null : selectedUserId,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Notification sent!" });
      setTitle("");
      setMessage("");
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">Send Notification</h1>

        <div className="flex gap-2">
          <Badge
            variant={isBroadcast ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            onClick={() => setIsBroadcast(true)}
          >
            <Users className="mr-1 h-3 w-3" /> All Users
          </Badge>
          <Badge
            variant={!isBroadcast ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            onClick={() => setIsBroadcast(false)}
          >
            <User className="mr-1 h-3 w-3" /> Specific User
          </Badge>
        </div>

        {!isBroadcast && (
          <div className="space-y-2">
            <Label>Select User</Label>
            <Input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredUsers.map(u => (
                <div
                  key={u.user_id}
                  className={`cursor-pointer rounded-lg p-2 text-xs transition-colors ${
                    selectedUserId === u.user_id ? "bg-primary/20 text-primary" : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedUserId(u.user_id)}
                >
                  {u.name} · {u.email}
                </div>
              ))}
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..." rows={4} />
            </div>
            <Button className="w-full gap-2" onClick={handleSend} disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminNotifications;
