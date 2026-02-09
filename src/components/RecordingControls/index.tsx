import { useState, useRef } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import {
  FiberManualRecord,
  PlayArrow,
  Pause,
  Cancel,
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

type Props = {
  setTranscription: (newTranscription: string) => void;
  setError: (error: string) => void;
  setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string;
};

const RecordingControls = ({
  setTranscription,
  setError,
  setIsCopied,
  apiKey,
}: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldProcessRef = useRef<boolean>(false);

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

  const sendAudioToServer = async (audioBlob: Blob) => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key before recording.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("apiKey", apiKey);

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
      } else {
        setError(result.error || "Transcription failed");
      }
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
      console.error("Transcription error:", err);
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
          await sendAudioToServer(audioBlob);
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

  const iconSx = {
    fontSize: 32,
    transition: "all 0.2s ease",
  };
  const disabledSx = { opacity: 0.3, cursor: "not-allowed" };

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
        </Stack>

        <Stack direction="row" justifyContent="center">
          <RecordingTimer isRecording={isRecording} isPaused={isPaused} />
        </Stack>
      </Stack>
    </>
  );
};

export default RecordingControls;
