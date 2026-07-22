import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useColorMode } from "../theme/ColorModeContext";

const AppHeader = () => {
  const { mode, toggleMode } = useColorMode();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ maxWidth: 960, mx: "auto", width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            WarriorWL Tools
          </Typography>
        </Box>
        <IconButton
          onClick={toggleMode}
          title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
