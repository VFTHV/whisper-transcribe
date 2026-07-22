import { Stack } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import HookWrapper from "./HookWrapper";
import RecordingTimer from "./RecordingTimer";
import RecordingToolbar from "./RecordingToolbar";
import PendingAudioBanner from "./PendingAudioBanner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectApiKey } from "../../features/settings/slice/selectors";
import {
  PendingSource,
  recordingActions,
  type PendingSource as PendingSourceType,
} from "../../features/recording/slice/reducers";
import {
  selectIsPaused,
  selectIsRecording,
  selectPendingFileName,
  selectPendingSource,
} from "../../features/recording/slice/selectors";
import { transcriptionActions } from "../../features/transcription/slice/reducers";
import { transcribeAudio } from "../../features/transcription/slice/command/transcribeAudio";

const RecordingControls = () => {
  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(selectApiKey);
  const isRecording = useAppSelector(selectIsRecording);
  const isPaused = useAppSelector(selectIsPaused);
  const pendingSource = useAppSelector(selectPendingSource);
  const pendingFileName = useAppSelector(selectPendingFileName);

  const [pendingAudio, setPendingAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldProcessRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const clearPending = useCallback(() => {
    setPendingAudio(null);
    dispatch(recordingActions.clearPending());
  }, [dispatch]);

  const preservePending = useCallback(
    (audioBlob: Blob, fileName: string, source: PendingSourceType) => {
      setPendingAudio(audioBlob);
      dispatch(recordingActions.preservePending({ fileName, source }));
    },
    [dispatch]
  );

  const sendAudioToServer = useCallback(
    async (
      audioBlob: Blob,
      fileName = "recording.webm",
      source: PendingSourceType = PendingSource.Recording
    ) => {
      if (!apiKey.trim()) {
        dispatch(
          transcriptionActions.setError(
            "Please enter your OpenAI API key before recording."
          )
        );
        preservePending(audioBlob, fileName, source);
        return;
      }

      try {
        await transcribeAudio({ audioBlob, fileName }).promise;
        clearPending();
      } catch {
        preservePending(audioBlob, fileName, source);
      }
    },
    [apiKey, clearPending, dispatch, preservePending]
  );

  const startRecording = useCallback(async () => {
    if (!apiKey.trim()) {
      dispatch(
        transcriptionActions.setError(
          "Please enter your OpenAI API key before recording."
        )
      );
      return;
    }

    try {
      dispatch(transcriptionActions.setError(""));
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
      dispatch(recordingActions.recordingStarted());

      if (document.hidden) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Recording Started", {
            body: "Voice recording is now active. Press Ctrl+K to stop.",
            icon: "/vite.svg",
          });
        }
      }
    } catch (err) {
      dispatch(
        transcriptionActions.setError(
          `Failed to start recording. Please check microphone permissions. ${err}`
        )
      );
      console.error("Recording error:", err);
    }
  }, [apiKey, dispatch, sendAudioToServer, stopStream]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      dispatch(recordingActions.recordingPaused());
    }
  }, [dispatch, isPaused, isRecording]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      dispatch(recordingActions.recordingResumed());
    }
  }, [dispatch, isPaused, isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = true;
      mediaRecorderRef.current.stop();
      dispatch(recordingActions.recordingStopped());
    }
  }, [dispatch, isRecording]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = false;
      mediaRecorderRef.current.stop();
      dispatch(recordingActions.recordingCancelled());
      audioChunksRef.current = [];
    }
  }, [dispatch, isRecording]);

  const handleStartOrStop = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      setPendingAudio(file);
      dispatch(recordingActions.setPendingUpload({ fileName: file.name }));
      dispatch(transcriptionActions.setError(""));
    },
    [dispatch]
  );

  const handleDismissPending = useCallback(() => {
    clearPending();
    dispatch(transcriptionActions.setError(""));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearPending, dispatch]);

  const transcribePendingAudio = useCallback(async () => {
    if (pendingAudio) {
      await sendAudioToServer(
        pendingAudio,
        pendingFileName || "recording.webm",
        pendingSource ?? PendingSource.Recording
      );
    }
  }, [pendingAudio, pendingFileName, pendingSource, sendAudioToServer]);

  const downloadRecording = useCallback(() => {
    if (!pendingAudio) {
      return;
    }
    const url = URL.createObjectURL(pendingAudio);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      pendingFileName || `recording-${new Date().toISOString()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pendingAudio, pendingFileName]);

  return (
    <>
      <HookWrapper
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
        <RecordingToolbar
          onStartOrStop={handleStartOrStop}
          onResume={resumeRecording}
          onPause={pauseRecording}
          onCancel={cancelRecording}
          onUpload={openFilePicker}
        />

        <Stack direction="row" justifyContent="center">
          <RecordingTimer />
        </Stack>

        {pendingAudio && (
          <PendingAudioBanner
            onDismiss={handleDismissPending}
            onTranscribe={() => {
              void transcribePendingAudio();
            }}
            onDownload={downloadRecording}
          />
        )}
      </Stack>
    </>
  );
};

export default RecordingControls;
