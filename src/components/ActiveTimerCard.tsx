import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useActiveTimer } from "../hooks/useActiveTimer";
import { useElapsedTime, formatDuration } from "../hooks/useElapsedTime";

type Props = {
  userId: string;
};

export function ActiveTimerCard({ userId }: Props) {
  const [taskName, setTaskName] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: timer,
    isLoading,
    isError,
    startTimer,
    stopTimer,
    isStarting,
    isStopping,
  } = useActiveTimer(userId);

  const elapsed = useElapsedTime(timer?.started_at);

  const handleStart = async () => {
    if (!taskName.trim()) {
      setErrorMessage("Enter a task name.");
      return;
    }

    setErrorMessage("");

    try {
      await startTimer({
        task_name: taskName.trim(),
        notes: notes.trim() || null,
      });

      setTaskName("");
      setNotes("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not start the timer."
      );
    }
  };

  const handleStop = async () => {
    setErrorMessage("");

    try {
      await stopTimer();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not stop the timer."
      );
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Time tracker</Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {isError && (
          <Alert severity="error">Could not load the active timer.</Alert>
        )}

        {isLoading ? (
          <Typography color="text.secondary">Loading timer...</Typography>
        ) : timer ? (
          <>
            <Box>
              <Typography color="text.secondary" variant="body2">
                Currently tracking
              </Typography>
              <Typography variant="h6">{timer.task_name}</Typography>
              <Typography
                variant="h3"
                sx={{
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 600,
                  my: 1,
                }}
              >
                {formatDuration(elapsed)}
              </Typography>
              {timer.notes && (
                <Typography color="text.secondary">{timer.notes}</Typography>
              )}
            </Box>

            <Button
              variant="contained"
              color="error"
              onClick={handleStop}
              disabled={isStopping}
            >
              {isStopping ? "Saving time..." : "Stop timer"}
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Task name"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Notes (optional)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              multiline
              minRows={2}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleStart}
              disabled={isStarting || !taskName.trim()}
            >
              {isStarting ? "Starting..." : "Start timer"}
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
}
