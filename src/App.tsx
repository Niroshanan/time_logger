import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { Login } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AdminRoute } from "./auth/AdminRoute";
import { AdminUsersPage } from "./pages/admin-users";
import { AcceptInvitePage } from "./pages/accept-invite";

// Quick template for a generic Profile screen
const Profile = () => <h2>Your Profile Settings</h2>;

// Quick template for a 404 screen
const NotFound = () => <h2>404 - Page Not Found</h2>;

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        {/* If user is already logged in, redirect away from login page to home */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Invite link lands here (the link signs the user in, then they set a password) */}
        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          {/* Automatically forward root "/" to dashboard if authenticated */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<Profile />} />

          {/* ADMIN-ONLY ROUTES */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        {/* CATCH-ALL ERROR ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
