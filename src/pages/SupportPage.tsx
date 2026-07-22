import { Typography, Button } from "@mui/material";
import { Email } from "@mui/icons-material";
import LegalPageLayout from "../layout/LegalPageLayout";

const SupportPage = () => (
  <LegalPageLayout title="Support">
    <Typography variant="body1">
      Running into an issue, have feedback, or just have a question about
      Whisper Transcribe? We&apos;d like to hear from you.
    </Typography>

    <Typography variant="body1">
      The in-app <strong>Instructions &amp; Shortcuts</strong> panel covers
      the basics — starting, pausing, and cancelling a recording, uploading
      audio files, and keyboard shortcuts. For anything else, reach out by
      email and we&apos;ll get back to you.
    </Typography>

    <Button
      variant="contained"
      startIcon={<Email />}
      href="mailto:info@warriorwl.com"
      sx={{ alignSelf: "flex-start" }}
    >
      info@warriorwl.com
    </Button>
  </LegalPageLayout>
);

export default SupportPage;
