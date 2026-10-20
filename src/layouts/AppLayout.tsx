import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function AppLayout() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar />
      <Outlet />
    </Box>
  );
}