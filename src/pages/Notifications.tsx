import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
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
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      setNotifications(data || []);
      setLoading(false);

      // Mark all as read
      if (data?.some(n => !n.is_read)) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", user.id)
          .eq("is_read", false);
      }
    };
    fetch();
  }, [user]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card key={n.id} className={!n.is_read ? "border-primary/30" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">{n.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {!n.is_read && <Badge className="bg-primary/20 text-primary text-xs">New</Badge>}
                      {n.is_broadcast && <Badge variant="outline" className="text-xs">All Users</Badge>}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
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
