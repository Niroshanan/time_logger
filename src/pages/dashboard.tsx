import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useIsAdmin } from "../hooks/useIsAdmin";
import type { TimeEntry } from "../api/timeEntries.api";
import { useTimeEntries } from "../hooks/useTimeEntries";
import { ActiveTimerCard } from "../components/ActiveTimerCard";
import { TimeEntryList } from "../components/TimeEntryList";
import { TimeEntryFormDialog } from "../components/TimeEntryFormDialog";
import { DeleteTimeEntryDialog } from "../components/DeleteTimeEntryDialog";
import ThemeToggle from "../components/ThemeToggle";

function getToday(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 10);
}

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();

  const [selectedDate, setSelectedDate] = useState<string>(getToday);

  const {
    data: entries = [],
    isLoading,
    isError,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTimeEntries(selectedDate, user?.id);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<TimeEntry | null>(null);
  const [actionError, setActionError] = useState("");

  const handleAdd = () => {
    setSelectedEntry(null);
    setActionError("");
    setFormOpen(true);
  };

  const handleEdit = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setActionError("");
    setFormOpen(true);
  };

  const handleSave = async (values: {
    task_name: string;
    entry_date: string;
    start_time: string;
    end_time: string;
    notes: string | null;
  }) => {
    if (!user) throw new Error("Please sign in first.");

    setActionError("");

    try {
      if (selectedEntry) {
        await updateEntry({
          id: selectedEntry.id,
          values,
        });
      } else {
        await createEntry({
          ...values,
          user_id: user.id,
        });
      }

      setFormOpen(false);
      setSelectedEntry(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not save entry."
      );
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!entryToDelete) return;

    setActionError("");

    try {
      await deleteEntry(entryToDelete.id);
      setEntryToDelete(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not delete entry."
      );
    }
  };

  if (!user) {
    return (
      <Container sx={{ py: 6 }}>
        {" "}
        <Typography>Please sign in to access time tracking.</Typography>{" "}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {" "}
      <Stack spacing={4}>
        {" "}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
          spacing={2}
        >
          {" "}
          <Box>
            {" "}
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {" "}
              Dashboard{" "}
            </Typography>{" "}
            <Typography color="text.secondary">
              {" "}
              Welcome, {user.email}{" "}
            </Typography>{" "}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add entry
            </Button>

            {isAdmin && (
              <Button component={RouterLink} to="/admin/users">
                Manage users
              </Button>
            )}

            <Button onClick={() => void signOut()}>Sign out</Button>
          </Stack>
        </Stack>
        {actionError && (
          <Alert severity="error" onClose={() => setActionError("")}>
            {actionError}
          </Alert>
        )}
        <ActiveTimerCard userId={user.id} />
        <Box>
          <TimeEntryList
            entries={entries}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onEdit={handleEdit}
            onDelete={setEntryToDelete}
          />

          {isLoading && (
            <Typography sx={{ mt: 2 }}>Loading time entries...</Typography>
          )}

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error instanceof Error
                ? error.message
                : "Failed to load time entries."}
            </Alert>
          )}
        </Box>
      </Stack>
      <TimeEntryFormDialog
        open={formOpen}
        entry={selectedEntry}
        saving={isCreating || isUpdating}
        onClose={() => {
          setFormOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={handleSave}
      />
      <DeleteTimeEntryDialog
        entry={entryToDelete}
        deleting={isDeleting}
        onClose={() => setEntryToDelete(null)}
        onConfirm={handleDelete}
      />
    </Container>
  );
}
