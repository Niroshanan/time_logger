import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { TimeEntry } from "../api/timeEntries.api";
import { calculateDuration } from "../utils/timeHelper";

type Props = {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
};

export function TimeEntryList({ entries, onEdit, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">No time entries yet</Typography>
        <Typography color="text.secondary">
          Start a timer or add your first time entry.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => (
        <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "stretch" }}>
            {/* Left column: task details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {entry.task_name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {entry.entry_date} · {entry.start_time.slice(0, 5)}
                {" – "}
                {entry.end_time.slice(0, 5)}
              </Typography>

              {entry.notes && (
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, overflowWrap: "anywhere" }}
                >
                  {entry.notes}
                </Typography>
              )}
            </Box>

            {/* Middle column: duration, centered across the content height */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                minWidth: 90,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
              >
                {calculateDuration(entry.start_time, entry.end_time)}
              </Typography>
            </Box>

            {/* Right column: actions */}
            <Stack
              direction="column"
              spacing={0.5}
              sx={{ justifyContent: "center", alignItems: "flex-end" }}
            >
              <Button
                size="small"
                startIcon={<EditOutlinedIcon />}
                onClick={() => onEdit(entry)}
              >
                Edit
              </Button>

              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => onDelete(entry)}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
