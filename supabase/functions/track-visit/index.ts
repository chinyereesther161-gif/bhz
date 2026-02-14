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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { user_id, page, device } = body;

    // Get IP from request headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") || "unknown";

    // Try to get country from IP using free API
    let country = "Unknown";
    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/country_name/`);
      if (geoRes.ok) {
        const text = await geoRes.text();
        if (text && !text.includes("Undefined") && !text.includes("error")) {
          country = text.trim();
        }
      }
    } catch {
      // Ignore geo lookup failures
    }

    // Insert visitor log
    await supabase.from("visitor_logs").insert({
      user_id: user_id || null,
      ip_address: ip,
      country,
      device: device || "Unknown",
      page: page || "/",
    });

    // Update profile if logged in user
    if (user_id) {
      await supabase.from("profiles").update({
        last_ip: ip,
        last_country: country,
        last_device: device || "Unknown",
      }).eq("user_id", user_id);
    }

    // Notify admins
    await supabase.from("notifications").insert({
      title: "🌐 New Visitor",
      message: `${user_id ? "Registered user" : "Anonymous visitor"} from ${country} (${ip}) visited ${page || "/"}`,
      is_broadcast: false,
      user_id: null,
    });

    // Actually we need to send to each admin individually
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (adminRoles?.length) {
      // Delete the broadcast one we just created
      // Instead, insert one per admin
      const notifications = adminRoles.map(r => ({
        title: "🌐 New Visitor",
        message: `${user_id ? "Registered user" : "Anonymous"} from ${country} (${ip}) · ${device || "Unknown"} · ${page || "/"}`,
        user_id: r.user_id,
        is_broadcast: false,
      }));
      await supabase.from("notifications").insert(notifications);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
