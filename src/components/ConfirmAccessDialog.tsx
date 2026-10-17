import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { AdminUser } from "../api/admin.api";

type Props = {
  user: AdminUser | null;
  /** true = reactivating the account, false = deactivating it */
  activate: boolean;
  saving: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function ConfirmAccessDialog({
  user,
  activate,
  saving,
  onClose,
  onConfirm,
}: Props) {
  const name = user?.full_name || user?.email;

  return (
    <Dialog open={Boolean(user)} onClose={() => !saving && onClose()}>
      <DialogTitle>
        {activate ? "Reactivate account?" : "Deactivate account?"}
      </DialogTitle>

      <DialogContent>
        <Typography>
          {activate
            ? `${name} will be able to sign in again.`
            : `${name} will no longer be able to sign in. Their time entries are kept.`}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          color={activate ? "primary" : "error"}
          variant="contained"
          onClick={() => void onConfirm()}
          disabled={saving || !user}
        >
          {saving ? "Saving..." : activate ? "Reactivate" : "Deactivate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
