import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  inviteUser,
  resendInvite,
  setUserActive,
} from "../api/admin.api";
import type { InviteUserInput } from "../api/admin.api";

const ADMIN_USERS_KEY = ["admin-users"] as const;

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });

  const query = useQuery({ queryKey: ADMIN_USERS_KEY, queryFn: getUsers });

  const invite = useMutation({
    mutationFn: (input: InviteUserInput) => inviteUser(input),
    onSuccess: invalidate,
  });

  const resend = useMutation({
    mutationFn: (email: string) => resendInvite(email),
    onSuccess: invalidate,
  });

  const setActive = useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) =>
      setUserActive(userId, active),
    onSuccess: invalidate,
  });

  return {
    ...query,
    inviteUser: invite.mutateAsync,
    resendInvite: resend.mutateAsync,
    setUserActive: setActive.mutateAsync,
    isInviting: invite.isPending,
    isResending: resend.isPending,
    isUpdatingAccess: setActive.isPending,
  };
}
