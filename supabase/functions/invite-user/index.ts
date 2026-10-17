import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Identify caller from their JWT
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return new Response("Unauthorized", { status: 401, headers: cors });

  const { data: me } = await admin.from("profiles")
    .select("role,is_active").eq("id", user.id).single();
  if (me?.role !== "admin" || !me.is_active)
    return new Response("Forbidden", { status: 403, headers: cors });

  const { email, full_name, role = "user", redirectTo } = await req.json();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role: role === "admin" ? "admin" : "user" },
    redirectTo,
  });
  if (error) return new Response(JSON.stringify({ error: error.message }),
    { status: 400, headers: { ...cors, "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ ok: true }),
    { headers: { ...cors, "Content-Type": "application/json" } });
});