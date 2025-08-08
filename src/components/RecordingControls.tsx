import { useState, useRef, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  onError: (error: string) => void;
  setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
};

export function RecordingControls({
  setTranscription,
  onError,
  setIsCopied,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldProcessRef = useRef<boolean>(false);

  const onTranscriptionComplete = async (newTranscription: string) => {
    setTranscription(newTranscription);
    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(newTranscription);
      // Show copied feedback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 100); // Brief trigger
    } catch (err) {
      console.error("Failed to auto-copy to clipboard:", err);
    }
  };

  // Global hotkey for recording
  useHotkeys(
    "ctrl+k",
    (e) => {
      e.preventDefault();
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    },
    { enableOnFormTags: true, scopes: ["global"] }
  );

  // Escape key to cancel recording
  useHotkeys(
    "escape",
    (e) => {
      if (isRecording) {
        e.preventDefault();
        cancelRecording();
      }
    },
    { enableOnFormTags: true, scopes: ["global"] }
  );

  // Listen for visibility changes to handle background recording
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRecording) {
        // Tab is now hidden, but recording continues
        console.log("Tab hidden, recording continues in background");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRecording]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsProcessing(true);
    onError("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("http://localhost:3001/api/transcribe", {
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
        onError("Transcription failed");
      }
    } catch (err) {
      onError("Failed to transcribe audio. Please try again.");
      console.error("Transcription error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      onError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      shouldProcessRef.current = false; // Reset the flag

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Only process audio if we're not canceling
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

      // Show notification if tab is not active
      if (document.hidden) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🎤 Recording Started", {
            body: "Voice recording is now active. Press Ctrl+K to stop.",
            icon: "/vite.svg",
          });
        }
      }
    } catch (err) {
      onError(
        "Failed to start recording. Please check microphone permissions."
      );
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = true; // Set flag to process audio
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = false; // Set flag to NOT process audio
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = []; // Clear the audio chunks
    }
  };

  return (
    <div className="recording-section">
      <div className="recording-buttons">
        <button
          className={`record-button ${isRecording ? "recording" : ""}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isRecording ? (
            <>
              <span className="recording-indicator"></span>
              Stop Recording
            </>
          ) : (
            <>🎤 Start Recording</>
          )}
        </button>

        {isRecording && (
          <button
            className="cancel-button"
            onClick={cancelRecording}
            disabled={isProcessing}
          >
            ❌ Cancel
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="processing">
          <div className="spinner"></div>
          <p>Processing your audio...</p>
        </div>
      )}
    </div>
  );
}
