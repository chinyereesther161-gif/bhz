import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Clock, CheckCircle } from "lucide-react";

interface SupportMessage {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

const AdminSupport = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, { name: string; email: string }>>({});

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("support_messages" as any)
      .select("*")
      .order("created_at", { ascending: false }) as any;
    setMessages(data || []);

    // Fetch user profiles
    if (data?.length) {
      const userIds = [...new Set(data.map((m: any) => m.user_id))];
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, name, email")
        .in("user_id", userIds as string[]);
      const map: Record<string, { name: string; email: string }> = {};
      profs?.forEach(p => { map[p.user_id] = { name: p.name, email: p.email }; });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleReply = async (msgId: string, userId: string) => {
    const reply = replyText[msgId]?.trim();
    if (!reply) return;

    setReplyingId(msgId);
    const { error } = await supabase
      .from("support_messages" as any)
      .update({ admin_reply: reply, replied_at: new Date().toISOString(), status: "resolved" } as any)
      .eq("id", msgId) as any;

    if (!error) {
      // Send notification to user
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Support Reply 💬",
        message: reply,
      });
      toast({ title: "Reply sent!" });
      setReplyText(prev => ({ ...prev, [msgId]: "" }));
      fetchMessages();
    }
    setReplyingId(null);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" /> Support Messages
        </h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No support messages yet</p>
        ) : (
          messages.map(msg => (
            <Card key={msg.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {profiles[msg.user_id]?.name || "Unknown"} · {profiles[msg.user_id]?.email || ""}
                    </p>
                  </div>
                  <Badge variant={msg.status === "open" ? "destructive" : "default"} className="text-[10px]">
                    {msg.status === "open" ? <><Clock className="h-3 w-3 mr-1" /> Open</> : <><CheckCircle className="h-3 w-3 mr-1" /> Resolved</>}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</p>

                {msg.admin_reply ? (
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p className="text-xs font-semibold text-primary">Admin Reply:</p>
                    <p className="text-sm">{msg.admin_reply}</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText[msg.id] || ""}
                      onChange={e => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                      rows={2}
                      className="text-sm"
                    />
                    <Button
                      size="icon"
                      onClick={() => handleReply(msg.id, msg.user_id)}
                      disabled={replyingId === msg.id}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default AdminSupport;
