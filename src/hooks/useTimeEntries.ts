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

export const timeEntriesKey = (userId: string, selectedDate: string,) => 
    ["time-entries", userId, selectedDate] as const;

export function useTimeEntries(selectedDate: string, userId?: string,) {
    const queryClient = useQueryClient();
    const queryKey = userId ? timeEntriesKey(userId, selectedDate) : ["time-entries", "signed-out", selectedDate];

    const query = useQuery({ queryKey, queryFn: () => getTimeEntries(userId!, selectedDate), enabled: Boolean(userId && selectedDate), });

    // Invalidate all cached dates for this user after mutations. 
    const invalidate = () => 
        queryClient.invalidateQueries({ queryKey: userId ? ["time-entries", userId] : ["time-entries", "signed-out"], });

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