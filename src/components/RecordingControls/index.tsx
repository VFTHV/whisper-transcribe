import { useState, useRef } from "react";
import { FaPlay, FaPause, FaCircle } from "react-icons/fa";
import { RiSquareFill } from "react-icons/ri";
import HookWrapper from "./HookWrapper";
import "./RecordingControls.css";
import { BsXSquareFill } from "react-icons/bs";

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
    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(newTranscription);
      // Show copied feedback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Brief trigger
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
      setError(
        "Failed to start recording. Please check microphone permissions."
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
      shouldProcessRef.current = true; // Set flag to process audio
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false); // Reset pause state
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldProcessRef.current = false; // Set flag to NOT process audio
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false); // Reset pause state
      audioChunksRef.current = []; // Clear the audio chunks
    }
  };

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
      <div className="tape-recorder-controls">
        {/* Record/Stop Button */}
        <FaCircle
          className={`tape-icon record-icon ${isRecording ? "recording" : ""} ${
            isRecording && !isPaused ? "active" : ""
          } ${isProcessing ? "disabled" : ""}`}
          onClick={
            isProcessing
              ? undefined
              : isRecording
              ? stopRecording
              : startRecording
          }
          title={isRecording ? "Stop Recording" : "Start Recording"}
        />

        {/* Play/Resume Button */}
        <FaPlay
          className={`tape-icon play-icon ${isPaused ? "active" : ""} ${
            isProcessing || !isRecording || !isPaused ? "disabled" : ""
          }`}
          onClick={isPaused && !isProcessing ? resumeRecording : undefined}
          title="Resume Recording"
        />

        {/* Pause Button */}
        <FaPause
          className={`tape-icon pause-icon ${
            isRecording && !isPaused ? "active" : ""
          } ${isProcessing || !isRecording || isPaused ? "disabled" : ""}`}
          onClick={
            isRecording && !isPaused && !isProcessing
              ? pauseRecording
              : undefined
          }
          title="Pause Recording"
        />

        {/* Cancel Button */}
        <BsXSquareFill
          className={`tape-icon cancel-icon ${isRecording ? "active" : ""} ${
            isProcessing || !isRecording ? "disabled" : ""
          }`}
          onClick={isRecording && !isProcessing ? cancelRecording : undefined}
          title="Cancel Recording"
        />
      </div>

      {isProcessing && (
        <div className="processing">
          <div className="spinner"></div>
          <p>Processing your audio...</p>
        </div>
      )}
    </>
  );
};

export default RecordingControls;
