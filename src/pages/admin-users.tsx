import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { getUserStatus } from "../api/admin.api";
import type { AdminUser, InviteUserInput, UserStatus } from "../api/admin.api";
import { InviteUserDialog } from "../components/InviteUserDialog";
import { ConfirmAccessDialog } from "../components/ConfirmAccessDialog";

const STATUS_CHIP: Record<
  UserStatus,
  { label: string; color: "success" | "warning" | "default" }
> = {
  active: { label: "Active", color: "success" },
  pending: { label: "Invitation pending", color: "warning" },
  deactivated: { label: "Deactivated", color: "default" },
};

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    inviteUser,
    resendInvite,
    setUserActive,
    isInviting,
    isResending,
    isUpdatingAccess,
  } = useAdminUsers();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [accessTarget, setAccessTarget] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [actionError, setActionError] = useState("");
  const [toast, setToast] = useState("");

  const counts = useMemo(() => {
    const c = { total: users.length, active: 0, pending: 0, deactivated: 0 };
    users.forEach((u) => {
      c[getUserStatus(u)] += 1;
    });
    return c;
  }, [users]);

  const visibleUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== "all" && getUserStatus(u) !== statusFilter) return false;
      if (!q) return true;
      return (
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q)
      );
    });
  }, [users, search, statusFilter]);

  const handleInvite = async (values: InviteUserInput) => {
    await inviteUser(values); // errors are shown inside the dialog
    setInviteOpen(false);
    setToast(`Invitation sent to ${values.email}`);
  };

  const handleResend = async (u: AdminUser) => {
    if (!u.email) return;
    setActionError("");
    try {
      await resendInvite(u.email);
      setToast(`Invitation resent to ${u.email}`);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not resend invitation.");
    }
  };

  const handleConfirmAccess = async () => {
    if (!accessTarget) return;
    setActionError("");
    try {
      await setUserActive({
        userId: accessTarget.id,
        active: !accessTarget.is_active,
      });
      setToast(
        accessTarget.is_active ? "Account deactivated" : "Account reactivated"
      );
      setAccessTarget(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update account.");
      setAccessTarget(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              User management
            </Typography>
            <Typography color="text.secondary">
              Manage application access and user invitations.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/dashboard">
              My time
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setInviteOpen(true)}
            >
              Invite user
            </Button>
          </Stack>
        </Stack>

        {/* Summary */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          {[
            ["All users", counts.total],
            ["Active", counts.active],
            ["Pending invitations", counts.pending],
            ["Deactivated", counts.deactivated],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {actionError && (
          <Alert severity="error" onClose={() => setActionError("")}>
            {actionError}
          </Alert>
        )}

        {/* Filters */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <TextField
            label="Status"
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | UserStatus)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="pending">Invitation pending</MenuItem>
            <MenuItem value="deactivated">Deactivated</MenuItem>
          </TextField>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date added</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleUsers.map((u) => {
                const status = getUserStatus(u);
                const isSelf = u.id === currentUser?.id;

                return (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.full_name || "—"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{u.role}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={STATUS_CHIP[status].label}
                        color={STATUS_CHIP[status].color}
                        variant={status === "deactivated" ? "outlined" : "filled"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {status === "pending" && (
                        <Button
                          size="small"
                          onClick={() => void handleResend(u)}
                          disabled={isResending}
                        >
                          Resend
                        </Button>
                      )}
                      <Button
                        size="small"
                        color={u.is_active ? "error" : "primary"}
                        onClick={() => setAccessTarget(u)}
                        disabled={isSelf}
                      >
                        {u.is_active ? "Deactivate" : "Reactivate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!isLoading && visibleUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {users.length === 0
                        ? "No users yet. Invite your first user."
                        : "No users match your filters."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {isLoading && <Typography>Loading users...</Typography>}
        {isError && (
          <Alert severity="error">
            {error instanceof Error ? error.message : "Failed to load users."}
          </Alert>
        )}
      </Stack>

      <InviteUserDialog
        open={inviteOpen}
        sending={isInviting}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
      />

      <ConfirmAccessDialog
        user={accessTarget}
        activate={accessTarget ? !accessTarget.is_active : false}
        saving={isUpdatingAccess}
        onClose={() => setAccessTarget(null)}
        onConfirm={handleConfirmAccess}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Container>
  );
}
