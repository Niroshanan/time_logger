// supabase/functions/admin-users/index.ts
// Admin-only actions that need the service-role key: invite, resend, set_active.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Who is calling?
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const { data: { user }, error: authError } = await admin.auth.getUser(token);
  if (authError || !user) return json({ error: "Unauthorized" }, 401);

  // 2. Are they an active admin? (checked server-side, never trusted from the client)
  const { data: me } = await admin
    .from("profiles")
    .select("role,is_active")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin" || !me.is_active) {
    return json({ error: "Admins only" }, 403);
  }

  // 3. Do the action
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  switch (body.action) {
    case "invite":
    case "resend": {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return json({ error: "Enter a valid email address." }, 400);

      const role = body.role === "admin" ? "admin" : "user";
      const fullName = String(body.full_name ?? "").trim() || null;

      const { error } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName, role },
        redirectTo: body.redirectTo,
      });
      if (error) {
        const msg = /already|registered|exists/i.test(error.message)
          ? "A user with this email already exists."
          : error.message;
        return json({ error: msg }, 400);
      }
      return json({ ok: true });
    }

    case "set_active": {
      const userId = String(body.userId ?? "");
      const active = Boolean(body.active);
      if (!userId) return json({ error: "userId is required" }, 400);
      if (userId === user.id) return json({ error: "You can't change your own access." }, 400);

      const { error: profileError } = await admin
        .from("profiles")
        .update({ is_active: active })
        .eq("id", userId);
      if (profileError) return json({ error: profileError.message }, 400);

      // Ban = they can no longer sign in or refresh their session.
      const { error: banError } = await admin.auth.admin.updateUserById(userId, {
        ban_duration: active ? "none" : "876000h",
      });
      if (banError) return json({ error: banError.message }, 400);

      return json({ ok: true });
    }

    default:
      return json({ error: "Unknown action" }, 400);
  }
});
