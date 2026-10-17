import type { Tables, TablesInsert, TablesUpdate } from "../utils/database.types";
import { supabase } from "../utils/supabase";


export type TimeEntry = Tables<"time_entries">;
export type CreateTimeEntry = TablesInsert<"time_entries">;
export type UpdateTimeEntry = TablesUpdate<"time_entries">;

export async function getTimeEntries(
    userId: string,
    date: string,
): Promise<TimeEntry[]> {
    const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("entry_date", date)
        .order("start_time", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function createTimeEntry(
    input: CreateTimeEntry,
): Promise<TimeEntry> {
    const { data, error } = await supabase
        .from("time_entries")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateTimeEntry(
    id: string,
    input: UpdateTimeEntry,
): Promise<TimeEntry> {
    const { data, error } = await supabase
        .from("time_entries")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteTimeEntry(id: string): Promise<void> {
    const { error } = await supabase
        .from("time_entries")
        .delete()
        .eq("id", id);

    if (error) throw error;
}