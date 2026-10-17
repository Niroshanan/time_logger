import type { Tables } from "../utils/database.types";
import { supabase } from "../utils/supabase";

export type ActiveTimer = Tables<"active_timers">;

export async function getActiveTimer(
    userId: string,
): Promise<ActiveTimer | null> {
    const { data, error } = await supabase
        .from("active_timers")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function startActiveTimer(input: {
    task_name: string;
    notes?: string | null;
}): Promise<ActiveTimer> {
    const { data, error } = await supabase
        .from("active_timers")
        .insert({
            task_name: input.task_name.trim(),
            notes: input.notes?.trim() || null,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function stopActiveTimer(): Promise<void> {
    const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const { error } = await supabase.rpc("stop_active_timer", {
        p_timezone: timezone,
    });

    if (error) throw error;
}