import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-black">Notifications</h1>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-card/15 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card className="bg-card/15 border-border/15">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <div className="rounded-2xl bg-secondary/30 p-5">
                <BellOff className="h-8 w-8 text-muted-foreground/20" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground/50">No notifications yet</p>
              <p className="text-xs text-muted-foreground/30">You'll see important updates here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={`overflow-hidden transition-all duration-300 ${!n.is_read ? "border-primary/15 bg-primary/[0.02]" : "border-border/10 bg-card/10"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-xl p-2.5 shrink-0 ${!n.is_read ? "bg-primary/10 border border-primary/10" : "bg-secondary/30"}`}>
                        <Bell className={`h-4 w-4 ${!n.is_read ? "text-primary" : "text-muted-foreground/30"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold">{n.title}</p>
                          <div className="flex gap-1.5 shrink-0">
                            {!n.is_read && <Badge className="bg-primary/10 text-primary border border-primary/10 text-[9px] py-0">New</Badge>}
                            {n.is_broadcast && <Badge variant="outline" className="text-[9px] py-0 border-border/15">All</Badge>}
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground/60 leading-relaxed">{n.message}</p>
                        <p className="mt-2.5 text-[10px] text-muted-foreground/25">
                          {new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
