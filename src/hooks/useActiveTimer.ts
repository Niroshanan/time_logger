import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    getActiveTimer,
    startActiveTimer,
    stopActiveTimer,
} from "../api/activeTimer.api";

export const activeTimerKey = (userId: string) =>
    ["active-timer", userId] as const;

export function useActiveTimer(userId?: string) {
    const queryClient = useQueryClient();
    const timerKey = userId
        ? activeTimerKey(userId)
        : ["active-timer", "signed-out"];

    const timerQuery = useQuery({
        queryKey: timerKey,
        queryFn: () => getActiveTimer(userId!),
        enabled: Boolean(userId),
        refetchOnWindowFocus: true,
    });

    const start = useMutation({
        mutationFn: startActiveTimer,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: timerKey }),
    });

    const stop = useMutation({
        mutationFn: stopActiveTimer,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: timerKey }),
                userId
                    ? queryClient.invalidateQueries({
                        queryKey: ["time-entries", userId],
                    })
                    : Promise.resolve(),
            ]);
        },
    });

    return {
        ...timerQuery,
        startTimer: start.mutateAsync,
        stopTimer: stop.mutateAsync,
        isStarting: start.isPending,
        isStopping: stop.isPending,
    };
}