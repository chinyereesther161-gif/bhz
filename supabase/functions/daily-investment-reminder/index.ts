import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all user_ids who have NO active investments
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("user_id, name");

    const { data: activeInvestments } = await supabase
      .from("investments")
      .select("user_id")
      .eq("status", "active");

    const investedUserIds = new Set(activeInvestments?.map(i => i.user_id) || []);
    const nonInvestors = (allProfiles || []).filter(p => !investedUserIds.has(p.user_id));

    let sent = 0;
    for (const user of nonInvestors) {
      // Check if we already sent a reminder in the last 24 hours
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recent } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.user_id)
        .eq("title", "Start Earning Today! 📈")
        .gte("created_at", since)
        .limit(1);

      if (recent && recent.length > 0) continue;

      await supabase.from("notifications").insert({
        user_id: user.user_id,
        title: "Start Earning Today! 📈",
        message: `Hey ${user.name || "there"}! You haven't activated an investment plan yet. Our AI engine is generating returns for investors every week. Visit the Packages page to start earning!`,
      });
      sent++;
    }

    return new Response(JSON.stringify({ success: true, reminders_sent: sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
