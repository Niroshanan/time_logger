import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { TimeEntry } from "../api/timeEntries.api";

export type TimeEntryFormValues = {
  task_name: string;
  entry_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
};

type Props = {
  open: boolean;
  entry?: TimeEntry | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: TimeEntryFormValues) => Promise<void>;
};

const today = () => {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  );
  return localDate.toISOString().slice(0, 10);
};

export function TimeEntryFormDialog({
  open,
  entry,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<TimeEntryFormValues>({
    task_name: "",
    entry_date: today(),
    start_time: "",
    end_time: "",
    notes: null,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    setErrorMessage("");
    setForm(
      entry
        ? {
            task_name: entry.task_name,
            entry_date: entry.entry_date,
            start_time: entry.start_time.slice(0, 5),
            end_time: entry.end_time.slice(0, 5),
            notes: entry.notes,
          }
        : {
            task_name: "",
            entry_date: today(),
            start_time: "",
            end_time: "",
            notes: null,
          }
    );
  }, [open, entry]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.task_name.trim()) {
      setErrorMessage("Task name is required.");
      return;
    }

    if (form.end_time <= form.start_time) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    try {
      await onSubmit({
        ...form,
        task_name: form.task_name.trim(),
        notes: form.notes?.trim() || null,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not save the time entry."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {entry ? "Edit time entry" : "Add time entry"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              label="Task name"
              value={form.task_name}
              onChange={(e) => setForm({ ...form, task_name: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Date"
              type="date"
              value={form.entry_date}
              onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Start time"
                type="time"
                value={form.start_time}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                label="End time"
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>

            <TextField
              label="Notes"
              value={form.notes ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value || null,
                })
              }
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
