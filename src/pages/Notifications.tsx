import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Notification = Tables<"notifications">;

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      setNotifications(data || []);
      setLoading(false);

      if (data?.some(n => !n.is_read)) {
        await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
      }
    };
    fetch();
  }, [user]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <h1 className="text-xl font-black">Notifications</h1>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-card/30 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card className="bg-card/30">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="rounded-full bg-secondary p-4">
                <BellOff className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/60">You'll see important updates here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card key={n.id} className={`transition-all ${!n.is_read ? "border-primary/20 bg-primary/3" : "bg-card/30"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-lg p-2 shrink-0 ${!n.is_read ? "bg-primary/10" : "bg-secondary"}`}>
                      <Bell className={`h-4 w-4 ${!n.is_read ? "text-primary" : "text-muted-foreground/50"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold">{n.title}</p>
                        <div className="flex gap-1 shrink-0">
                          {!n.is_read && <Badge className="bg-primary/15 text-primary text-[9px] py-0">New</Badge>}
                          {n.is_broadcast && <Badge variant="outline" className="text-[9px] py-0">All</Badge>}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                      <p className="mt-2 text-[10px] text-muted-foreground/40">
                        {new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
