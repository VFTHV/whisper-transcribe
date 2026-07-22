import { Alert, Button, Stack } from "@mui/material";
import { Download, Mic, Refresh } from "@mui/icons-material";
import { useAppSelector } from "../../store/hooks";
import { PendingSource } from "../../features/recording/slice/reducers";
import {
  selectIsUploadPending,
  selectPendingFileName,
  selectPendingSource,
} from "../../features/recording/slice/selectors";
import { selectTranscribeAudioLoading } from "../../features/transcription/slice/command/transcribeAudio";

type Props = {
  onDismiss: () => void;
  onTranscribe: () => void;
  onDownload: () => void;
};

const PendingAudioBanner = ({
  onDismiss,
  onTranscribe,
  onDownload,
}: Props) => {
  const pendingFileName = useAppSelector(selectPendingFileName);
  const pendingSource = useAppSelector(selectPendingSource);
  const isUploadPending = useAppSelector(selectIsUploadPending);
  const isProcessing = useAppSelector(selectTranscribeAudioLoading);
  const isUploadSource = pendingSource === PendingSource.Upload;

  const message = isUploadPending
    ? `Audio ready: ${pendingFileName || "uploaded file"}`
    : isUploadSource
      ? `Transcription failed for ${pendingFileName || "uploaded file"}. You can retry or download.`
      : "Recording saved! The transcription request failed, but your recording is preserved.";

  return (
    <Alert
      severity={isUploadPending ? "info" : "warning"}
      onClose={onDismiss}
      sx={{ mt: 2 }}
    >
      {message}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={isUploadPending ? <Mic /> : <Refresh />}
          onClick={onTranscribe}
          disabled={isProcessing}
          sx={{ flex: 1 }}
        >
          {isUploadPending ? "Transcribe" : "Retry"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download />}
          onClick={onDownload}
          sx={{ flex: 1 }}
        >
          Download
        </Button>
      </Stack>
    </Alert>
  );
};

export default PendingAudioBanner;
