import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    createTimeEntry,
    deleteTimeEntry,
    getTimeEntries,
    updateTimeEntry,
} from "../api/timeEntries.api";
import type {
    CreateTimeEntry,
    UpdateTimeEntry,
} from "../api/timeEntries.api";

export const timeEntriesKey = (userId: string) =>
    ["time-entries", userId] as const;

export function useTimeEntries(userId?: string) {
    const queryClient = useQueryClient();
    const queryKey = userId
        ? timeEntriesKey(userId)
        : ["time-entries", "signed-out"];

    const query = useQuery({
        queryKey,
        queryFn: () => getTimeEntries(userId!),
        enabled: Boolean(userId),
    });

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey });

    const create = useMutation({
        mutationFn: (input: CreateTimeEntry) => createTimeEntry(input),
        onSuccess: invalidate,
    });

    const update = useMutation({
        mutationFn: ({
            id,
            values,
        }: {
            id: string;
            values: UpdateTimeEntry;
        }) => updateTimeEntry(id, values),
        onSuccess: invalidate,
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteTimeEntry(id),
        onSuccess: invalidate,
    });

    return {
        ...query,
        createEntry: create.mutateAsync,
        updateEntry: update.mutateAsync,
        deleteEntry: remove.mutateAsync,
        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
    };
}