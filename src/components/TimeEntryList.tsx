import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { TimeEntry } from "../api/timeEntries.api";
import { calculateDuration } from "../utils/timeHelper";

type Props = {
  entries: TimeEntry[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
};

export function TimeEntryList({
  entries,
  selectedDate,
  onDateChange,
  onEdit,
  onDelete,
}: Props) {
  // Also prevent entries from another date showing during a refetch.
  const filteredEntries = entries.filter(
    (entry) => entry.entry_date === selectedDate
  );

  return (
    <Box>
      {" "}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}
      >
        {" "}
        <Typography variant="h5" sx={{ fontWeight: 600, flexShrink: 0 }}>
          {" "}
          Time entries{" "}
        </Typography>
        <TextField
          type="date"
          size="small"
          value={selectedDate}
          onChange={(event) => {
            if (event.target.value) {
              onDateChange(event.target.value);
            }
          }}
          sx={{ width: { xs: 155, sm: 180 } }}
        />
      </Stack>
      {filteredEntries.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">No time entries for this date</Typography>
          <Typography color="text.secondary">
            Select another date or add a time entry.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {filteredEntries.map((entry) => (
            <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={{ xs: 1, sm: 2 }}
                sx={{ alignItems: "stretch" }}
              >
                {/* Task details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
                  >
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

                {/* Duration */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    minWidth: { xs: 64, sm: 90 },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      fontSize: { xs: "0.95rem", sm: "1.5rem" },
                    }}
                  >
                    {calculateDuration(entry.start_time, entry.end_time)}
                  </Typography>
                </Box>

                {/* Actions */}
                <Stack
                  direction="column"
                  spacing={0.5}
                  sx={{
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
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
      )}
    </Box>
  );
}
