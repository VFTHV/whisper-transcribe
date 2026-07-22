import type { ReactNode } from "react";
import { Box, Container, Stack, Typography, Link as MuiLink } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

type Props = {
  title: string;
  children: ReactNode;
};

const LegalPageLayout = ({ title, children }: Props) => (
  <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 3 } }}>
    <MuiLink
      component={RouterLink}
      to="/"
      underline="hover"
      color="text.secondary"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 3 }}
    >
      <ArrowBack fontSize="small" />
      Back to app
    </MuiLink>
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        {title}
      </Typography>
    </Stack>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</Box>
  </Container>
);

export default LegalPageLayout;
