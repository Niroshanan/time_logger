import { FunctionsHttpError } from "@supabase/supabase-js";
import type { Database } from "../utils/database.types";
import { supabase } from "../utils/supabase";

export type AdminUser =
  Database["public"]["Functions"]["admin_list_users"]["Returns"][number];

export type UserRole = "user" | "admin";

export type InviteUserInput = {
  email: string;
  full_name?: string;
  role: UserRole;
};

export type UserStatus = "active" | "pending" | "deactivated";

export function getUserStatus(user: AdminUser): UserStatus {
  if (!user.is_active) return "deactivated";
  // Invited, but never finished setting a password
  if (user.invited_at && !user.password_set) return "pending";
  return "active";
}

// Calls the `admin-users` Edge Function and surfaces its error message.
async function callAdminFunction(body: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.functions.invoke("admin-users", { body });

  if (error) {
    let message = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const payload = await error.context.json();
        if (payload?.error) message = payload.error;
      } catch {
        /* keep default message */
      }
    }
    throw new Error(message);
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.rpc("admin_list_users");
  if (error) throw error;
  return data ?? [];
}

const redirectTo = () => `${window.location.origin}/accept-invite`;

export function inviteUser(input: InviteUserInput) {
  return callAdminFunction({ action: "invite", ...input, redirectTo: redirectTo() });
}

export function resendInvite(email: string) {
  return callAdminFunction({ action: "resend", email, redirectTo: redirectTo() });
}

export function setUserActive(userId: string, active: boolean) {
  return callAdminFunction({ action: "set_active", userId, active });
}
