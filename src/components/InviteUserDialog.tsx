import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { InviteUserInput, UserRole } from "../api/admin.api";

type Props = {
  open: boolean;
  sending: boolean;
  onClose: () => void;
  onSubmit: (values: InviteUserInput) => Promise<void>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteUserDialog({ open, sending, onClose, onSubmit }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setFullName("");
    setEmail("");
    setRole("user");
    setErrorMessage("");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    try {
      await onSubmit({
        email: cleanEmail,
        full_name: fullName.trim() || undefined,
        role,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send the invitation."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !sending && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Invite user</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Role"
              select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              fullWidth
            >
              <MenuItem value="user">Regular user</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={sending}>
            {sending ? "Sending..." : "Send invitation"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
