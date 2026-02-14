import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Smartphone, MapPin, Clock } from "lucide-react";

interface VisitorLog {
  id: string;
  user_id: string | null;
  ip_address: string | null;
  country: string | null;
  device: string | null;
  page: string | null;
  created_at: string;
}

const AdminVisitors = () => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { name: string; email: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("visitor_logs" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100) as any;
      setLogs(data || []);

      const userIds = (data || []).filter((l: any) => l.user_id).map((l: any) => l.user_id);
      if (userIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, name, email")
          .in("user_id", [...new Set(userIds)] as string[]);
        const map: Record<string, { name: string; email: string }> = {};
        profs?.forEach(p => { map[p.user_id] = { name: p.name, email: p.email }; });
        setProfiles(map);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" /> Visitor Logs
        </h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No visitor logs yet</p>
        ) : (
          logs.map(log => (
            <Card key={log.id}>
              <CardContent className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">
                    {log.user_id && profiles[log.user_id]
                      ? profiles[log.user_id].name
                      : "Anonymous Visitor"}
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(log.created_at).toLocaleString()}
                  </Badge>
                </div>
                {log.user_id && profiles[log.user_id] && (
                  <p className="text-xs text-muted-foreground">{profiles[log.user_id].email}</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {log.ip_address && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Globe className="h-3 w-3" /> {log.ip_address}
                    </Badge>
                  )}
                  {log.country && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <MapPin className="h-3 w-3" /> {log.country}
                    </Badge>
                  )}
                  {log.device && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Smartphone className="h-3 w-3" /> {log.device}
                    </Badge>
                  )}
                  {log.page && (
                    <Badge variant="outline" className="text-[10px]">{log.page}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default AdminVisitors;
