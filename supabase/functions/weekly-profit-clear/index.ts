import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get all profiles with weekly_pnl > 0
    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id, user_id, balance, weekly_pnl")
      .gt("weekly_pnl", 0);

    if (fetchError) throw fetchError;

    let cleared = 0;
    for (const profile of profiles || []) {
      const newBalance = profile.balance + profile.weekly_pnl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance, weekly_pnl: 0 })
        .eq("id", profile.id);

      if (!updateError) {
        // Notify user
        await supabase.from("notifications").insert({
          user_id: profile.user_id,
          title: "Weekly Profits Credited! 💰",
          message: `Your weekly profit of $${profile.weekly_pnl.toFixed(2)} has been added to your available balance. You can now withdraw your earnings.`,
        });
        cleared++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, profiles_cleared: cleared }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
