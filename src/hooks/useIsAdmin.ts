import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { useAuth } from "../auth/AuthContext";

// Uses the same is_admin() function your RLS policies rely on.
// This only controls what the UI shows; the database and Edge Function enforce access.
export function useIsAdmin() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) throw error;
      return Boolean(data);
    },
    enabled: Boolean(user),
    staleTime: 5 * 60_000,
  });

  return { isAdmin: query.data === true, isLoading: query.isLoading };
}
