import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const AppLayout = () => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <AppHeader />
    <Box component="main" sx={{ flex: 1 }}>
      <Outlet />
    </Box>
    <AppFooter />
  </Box>
);

export default AppLayout;
