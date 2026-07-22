import { Box, IconButton, Stack } from "@mui/material";
import {
  FiberManualRecord,
  PlayArrow,
  Pause,
  Cancel,
  Upload,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { useAppSelector } from "../../store/hooks";
import {
  selectIsPaused,
  selectIsRecording,
} from "../../features/recording/slice/selectors";
import { selectTranscribeAudioLoading } from "../../features/transcription/slice/command/transcribeAudio";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const recordBlink = keyframes`
  0%, 50% { opacity: 1; transform: scale(1); }
  25%, 75% { opacity: 0.7; transform: scale(1.05); }
`;

type Props = {
  onStartOrStop: () => void;
  onResume: () => void;
  onPause: () => void;
  onCancel: () => void;
  onUpload: () => void;
};

const RecordingToolbar = ({
  onStartOrStop,
  onResume,
  onPause,
  onCancel,
  onUpload,
}: Props) => {
  const isRecording = useAppSelector(selectIsRecording);
  const isPaused = useAppSelector(selectIsPaused);
  const isProcessing = useAppSelector(selectTranscribeAudioLoading);

  const iconSx = {
    fontSize: 32,
    transition: "all 0.2s ease",
  };
  const disabledSx = { opacity: 0.3, cursor: "not-allowed" };
  const canUpload = !isRecording && !isProcessing;

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      {isProcessing ? (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            width: 40,
            height: 40,
            border: "3px solid",
            borderColor: "primary.main",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: `${spin} 1s linear infinite`,
          }}
        />
      ) : (
        <IconButton
          onClick={onStartOrStop}
          disabled={isProcessing}
          sx={{
            color: isRecording ? "error.main" : "grey.500",
            ...(isRecording &&
              !isPaused && {
                animation: `${recordBlink} 1s infinite`,
              }),
            "&:hover:not(:disabled)": {
              color: isRecording ? "error.dark" : "error.light",
            },
            ...iconSx,
          }}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <FiberManualRecord sx={{ fontSize: 36 }} />
        </IconButton>
      )}

      <IconButton
        onClick={isPaused && !isProcessing ? onResume : undefined}
        disabled={isProcessing || !isRecording || !isPaused}
        sx={{
          color: isPaused ? "success.main" : "grey.500",
          "&:hover:not(:disabled)": { color: "success.light" },
          ...iconSx,
          ...(isProcessing || !isRecording || !isPaused ? disabledSx : {}),
        }}
        title="Resume Recording"
      >
        <PlayArrow sx={{ fontSize: 32 }} />
      </IconButton>

      <IconButton
        onClick={
          isRecording && !isPaused && !isProcessing ? onPause : undefined
        }
        disabled={isProcessing || !isRecording || isPaused}
        sx={{
          color: isRecording && !isPaused ? "warning.main" : "grey.500",
          "&:hover:not(:disabled)": { color: "warning.light" },
          ...iconSx,
          ...(isProcessing || !isRecording || isPaused ? disabledSx : {}),
        }}
        title="Pause Recording"
      >
        <Pause sx={{ fontSize: 32 }} />
      </IconButton>

      <IconButton
        onClick={isRecording && !isProcessing ? onCancel : undefined}
        disabled={isProcessing || !isRecording}
        sx={{
          color: isRecording ? "error.main" : "grey.500",
          "&:hover:not(:disabled)": { color: "error.light" },
          ...iconSx,
          ...(isProcessing || !isRecording ? disabledSx : {}),
        }}
        title="Cancel Recording"
      >
        <Cancel sx={{ fontSize: 32 }} />
      </IconButton>

      <IconButton
        onClick={canUpload ? onUpload : undefined}
        disabled={!canUpload}
        sx={{
          color: canUpload ? "primary.main" : "grey.500",
          "&:hover:not(:disabled)": { color: "primary.light" },
          ...iconSx,
          ...(!canUpload ? disabledSx : {}),
        }}
        title="Upload Audio"
      >
        <Upload sx={{ fontSize: 32 }} />
      </IconButton>
    </Stack>
  );
};

export default RecordingToolbar;
