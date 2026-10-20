import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useIsAdmin } from "../hooks/useIsAdmin";
import ThemeToggle from "./ThemeToggle";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: "inherit",
  textDecoration: "none",
  fontWeight: isActive ? 700 : 500,
  borderBottom: isActive ? "2px solid currentColor" : "2px solid transparent",
  borderRadius: 0,
  padding: "8px 4px",
});

export function Navbar() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 3, flexWrap: "wrap" }}>
          <Typography
            component={NavLink}
            to="/dashboard"
            variant="h6"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
              flexGrow: 1,
            }}
          >
            TimeTracker
          </Typography>

          {user && (
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              sx={{ flexWrap: "wrap",alightItems:"center" }}
            >
              <Box
                component={NavLink}
                to="/dashboard"
                style={navLinkStyle}
              >
                Dashboard
              </Box>

              <Box
                component={NavLink}
                to="/profile"
                style={navLinkStyle}
              >
                Profile
              </Box>

              {isAdmin && (
                <Box
                  component={NavLink}
                  to="/admin/users"
                  style={navLinkStyle}
                >
                  Admin Users
                </Box>
              )}

              <ThemeToggle />

              <Button
                color="inherit"
                onClick={() => void signOut()}
              >
                Sign out
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}