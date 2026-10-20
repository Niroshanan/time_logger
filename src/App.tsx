import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import { Login } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AdminRoute } from "./auth/AdminRoute";
import { AdminUsersPage } from "./pages/admin-users";
import { AcceptInvitePage } from "./pages/accept-invite";
import { AppLayout } from "./layouts/AppLayout";

const Profile = () => <h2>Your Profile Settings</h2>;

const NotFound = () => <h2>404 - Page Not Found</h2>;

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/accept-invite"
          element={<AcceptInvitePage />}
        />

        {/* Protected routes with shared layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route
                path="/admin/users"
                element={<AdminUsersPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;