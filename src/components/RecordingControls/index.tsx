import { useState, useRef } from "react";
import { Box, IconButton, Stack, Button, Alert } from "@mui/material";
import {
  FiberManualRecord,
  PlayArrow,
  Pause,
  Cancel,
  Refresh,
  Download,
  Upload,
  Mic,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
import HookWrapper from "./HookWrapper";
import RecordingTimer from "./RecordingTimer";
import { getApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

const recordBlink = keyframes`
  0%, 50% { opacity: 1; transform: scale(1); }
  25%, 75% { opacity: 0.7; transform: scale(1.05); }
`;

enum PendingSource {
  Upload = "upload",
  Recording = "recording",
}

type Props = {
  setTranscription: (newTranscription: string) => void;
  setError: (error: string) => void;
  setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string;
  model: string;
};

const RecordingControls = ({
  setTranscription,
  setError,
  setIsCopied,
  apiKey,
  model,
}: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAudio, setPendingAudio] = useState<Blob | null>(null);
  const [pendingSource, setPendingSource] = useState<PendingSource | null>(
    null
  );
  const [pendingFileName, setPendingFileName] = useState<string>("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldProcessRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onTranscriptionComplete = async (newTranscription: string) => {
    setTranscription(newTranscription);
    try {
      await navigator.clipboard.writeText(newTranscription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to auto-copy to clipboard:", err);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const clearPendingAudio = () => {
    setPendingAudio(null);
    setPendingSource(null);
    setPendingFileName("");
    setHasFailedAttempt(false);
  };

  const preservePendingAudio = (
    audioBlob: Blob,
    fileName: string,
    source: PendingSource
  ) => {
    setPendingAudio(audioBlob);
    setPendingFileName(fileName);
    setPendingSource(source);
    setHasFailedAttempt(true);
  };

  const sendAudioToServer = async (
    audioBlob: Blob,
    fileName = "recording.webm",
    source: PendingSource = PendingSource.Recording
  ) => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key before recording.");
      preservePendingAudio(audioBlob, fileName, source);
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, fileName);
      formData.append("apiKey", apiKey);
      formData.append("model", model);

      const response = await fetch(getApiUrl(API_ENDPOINTS.TRANSCRIBE), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        onTranscriptionComplete(result.transcription);
        clearPendingAudio();
      } else {
        setError(result.error || "Transcription failed");
        preservePendingAudio(audioBlob, fileName, source);
      }
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
      console.error("Transcription error:", err);
      preservePendingAudio(audioBlob, fileName, source);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key before recording.");
      return;
    }

    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      shouldProcessRef.current = false;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (shouldProcessRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          await sendAudioToServer(
            audioBlob,
            "recording.webm",
            PendingSource.Recording
          );
        }
        stopStream();
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (document.hidden) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Recording Started", {
            body: "Voice recording is now active. Press Ctrl+K to stop.",
            icon: "/vite.svg",
          });
        }
      }
    } catch (err) {
      setError(
        `Failed to start recording. Please check microphone permissions. ${err}`
      );
      console.error("Recording error:", err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = true;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      audioChunksRef.current = [];
    }
  };

  const transcribePendingAudio = async () => {
    if (pendingAudio) {
      await sendAudioToServer(
        pendingAudio,
        pendingFileName || "recording.webm",
        pendingSource ?? PendingSource.Recording
      );
    }
  };

  const downloadRecording = () => {
    if (pendingAudio) {
      const url = URL.createObjectURL(pendingAudio);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        pendingFileName || `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const dismissPendingAudio = () => {
    clearPendingAudio();
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPendingAudio(file);
    setPendingSource(PendingSource.Upload);
    setPendingFileName(file.name);
    setHasFailedAttempt(false);
    setError("");
  };

  const iconSx = {
    fontSize: 32,
    transition: "all 0.2s ease",
  };
  const disabledSx = { opacity: 0.3, cursor: "not-allowed" };
  const canUpload = !isRecording && !isProcessing;
  const isUploadPending =
    pendingSource === PendingSource.Upload && !hasFailedAttempt;

  return (
    <>
      <HookWrapper
        isRecording={isRecording}
        isPaused={isPaused}
        startRecording={startRecording}
        stopRecording={stopRecording}
        pauseRecording={pauseRecording}
        resumeRecording={resumeRecording}
        cancelRecording={cancelRecording}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.webm,.mp3,.wav,.m4a,.ogg,.mp4"
        hidden
        onChange={handleFileUpload}
      />

      <Stack
        direction="column"
        alignItems="stretch"
        spacing={2}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "2px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
        }}
      >
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
              onClick={isRecording ? stopRecording : startRecording}
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
            onClick={isPaused && !isProcessing ? resumeRecording : undefined}
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
              isRecording && !isPaused && !isProcessing
                ? pauseRecording
                : undefined
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
            onClick={isRecording && !isProcessing ? cancelRecording : undefined}
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
            onClick={canUpload ? openFilePicker : undefined}
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

        <Stack direction="row" justifyContent="center">
          <RecordingTimer isRecording={isRecording} isPaused={isPaused} />
        </Stack>

        {pendingAudio && (
          <Alert
            severity={isUploadPending ? "info" : "warning"}
            onClose={dismissPendingAudio}
            sx={{ mt: 2 }}
          >
            {isUploadPending
              ? `Audio ready: ${pendingFileName || "uploaded file"}`
              : pendingSource === PendingSource.Upload
                ? `Transcription failed for ${pendingFileName || "uploaded file"}. You can retry or download.`
                : "Recording saved! The transcription request failed, but your recording is preserved."}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={isUploadPending ? <Mic /> : <Refresh />}
                onClick={transcribePendingAudio}
                disabled={isProcessing}
                sx={{ flex: 1 }}
              >
                {isUploadPending ? "Transcribe" : "Retry"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download />}
                onClick={downloadRecording}
                sx={{ flex: 1 }}
              >
                Download
              </Button>
            </Stack>
          </Alert>
        )}
      </Stack>
    </>
  );
};

export default RecordingControls;
