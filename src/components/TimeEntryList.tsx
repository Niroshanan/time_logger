import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { TimeEntry } from "../api/timeEntries.api";

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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
            }}
            spacing={2}
          >
            <Box sx={{ minWidth: 0 }}>
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

            <Stack direction="row" spacing={1}>
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
