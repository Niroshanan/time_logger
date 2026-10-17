import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
  } from "@mui/material";
  import type { TimeEntry } from "../api/timeEntries.api";
  
  type Props = {
    entry: TimeEntry | null;
    deleting: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
  };
  
  export function DeleteTimeEntryDialog({
    entry,
    deleting,
    onClose,
    onConfirm,
  }: Props) {
    return (
      <Dialog
        open={Boolean(entry)}
        onClose={() => !deleting && onClose()}
      >
        <DialogTitle>Delete time entry?</DialogTitle>
  
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{entry?.task_name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
  
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void onConfirm()}
            disabled={deleting || !entry}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }