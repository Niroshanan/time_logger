import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../utils/supabase";

// The invite email link signs the user in (session is read from the URL by supabase-js).
// All we do here is let them choose a password.
export function AcceptInvitePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      password,
      data: { password_set: true }, // lets the admin page show "Active" instead of "Pending"
    });
    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <Box
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", p: 2 }}
    >
      <Container maxWidth="xs">
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : !user ? (
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Invitation link invalid
              </Typography>
              <Alert severity="error">
                This invitation link is invalid or has expired. Ask an admin to
                send you a new one.
              </Alert>
              <Button component={RouterLink} to="/login">
                Go to login
              </Button>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Welcome!
                  </Typography>
                  <Typography color="text.secondary">
                    Set a password to activate {user.email}.
                  </Typography>
                </Box>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saving..." : "Activate account"}
                </Button>
              </Stack>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
