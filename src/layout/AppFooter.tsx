import { Box, Container, Stack, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const AppFooter = () => (
  <Box
    component="footer"
    sx={{
      mt: "auto",
      py: 4,
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          WarriorWL
        </Typography>
        <Typography variant="caption" color="text.secondary" component="p">
          © {new Date().getFullYear()} WarriorWL Tools. All rights reserved.
        </Typography>
      </Box>
      <Stack direction="row" spacing={3}>
        <MuiLink
          component={RouterLink}
          to="/privacy"
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          Privacy Policy
        </MuiLink>
        <MuiLink
          component={RouterLink}
          to="/terms"
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          Terms of Service
        </MuiLink>
        <MuiLink
          component={RouterLink}
          to="/support"
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          Support
        </MuiLink>
      </Stack>
    </Container>
  </Box>
);

export default AppFooter;
