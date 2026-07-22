import { Typography, Link as MuiLink } from "@mui/material";
import LegalPageLayout from "../layout/LegalPageLayout";

const PrivacyPolicyPage = () => (
  <LegalPageLayout title="Privacy Policy">
    <Typography variant="body1">
      Whisper Transcribe is a browser-based tool for recording or uploading
      audio and turning it into text using OpenAI&apos;s Whisper and GPT-4o
      transcription models, using your own OpenAI API key.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      What we collect
    </Typography>
    <Typography variant="body1">
      We don&apos;t run accounts or store your data on our servers. Your
      OpenAI API key stays in your browser and is only sent to your own
      OpenAI account when a transcription request is made. Audio you record
      or upload is sent to OpenAI for transcription and is not retained by
      us. Your transcription history and theme preference are stored only in
      your browser&apos;s local storage and never leave your device.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      Third parties
    </Typography>
    <Typography variant="body1">
      Transcription requests are processed by OpenAI, subject to
      OpenAI&apos;s own privacy policy and terms. We also use Google
      Analytics (GA4) to collect anonymous, aggregate usage statistics.
    </Typography>

    <Typography variant="h6" component="h2" fontWeight={600}>
      Disclaimer
    </Typography>
    <Typography variant="body1">
      This app is provided &quot;as is,&quot; without warranty of any kind.
      WarriorWL is not responsible for any loss of data, transcription
      errors, unauthorized use of your API key, charges incurred on your
      OpenAI account, or any other damage or loss arising from your use of
      this app. Use it at your own risk.
    </Typography>

    <Typography variant="body1">
      Questions about this policy? Email{" "}
      <MuiLink href="mailto:info@warriorwl.com">info@warriorwl.com</MuiLink>.
    </Typography>
  </LegalPageLayout>
);

export default PrivacyPolicyPage;
