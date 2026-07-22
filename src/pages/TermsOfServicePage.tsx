import { Typography, Link as MuiLink } from "@mui/material";
import LegalPageLayout from "../layout/LegalPageLayout";

const TermsOfServicePage = () => (
  <LegalPageLayout title="Terms of Service">
    <Typography variant="body1">
      By using Whisper Transcribe, you agree to these terms. If you don&apos;t
      agree, please don&apos;t use the app.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      Using the app
    </Typography>
    <Typography variant="body1">
      Whisper Transcribe lets you record or upload audio and transcribe it
      using your own OpenAI API key. You&apos;re responsible for keeping that
      key secure and for any usage or charges billed to your OpenAI account.
      You agree not to use the app for any unlawful purpose or in a way that
      violates OpenAI&apos;s usage policies.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      No warranty
    </Typography>
    <Typography variant="body1">
      This app is provided &quot;as is&quot; and &quot;as available,&quot;
      without any warranty of accuracy, availability, or fitness for a
      particular purpose. Transcription results may contain errors and
      shouldn&apos;t be relied on for critical decisions without review.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      Limitation of liability
    </Typography>
    <Typography variant="body1">
      WarriorWL is not liable for any damages, costs, or losses — direct or
      indirect — arising from your use of, or inability to use, this app,
      including but not limited to data loss, transcription inaccuracies, or
      OpenAI API charges.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      Changes
    </Typography>
    <Typography variant="body1">
      We may update the app or these terms at any time. Continued use after
      changes means you accept the updated terms.
    </Typography>

    <Typography variant="body1">
      Questions? Email{" "}
      <MuiLink href="mailto:info@warriorwl.com">info@warriorwl.com</MuiLink>.
    </Typography>
  </LegalPageLayout>
);

export default TermsOfServicePage;
