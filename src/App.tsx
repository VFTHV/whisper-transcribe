import { useState, useRef } from "react";
import "./App.css";

interface TranscriptionResult {
  success: boolean;
  transcription: string;
  language: string;
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await sendAudioToServer(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(
        "Failed to start recording. Please check microphone permissions."
      );
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError("");

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

      const result: TranscriptionResult = await response.json();

      if (result.success) {
        setTranscription(result.transcription);
      } else {
        setError("Transcription failed");
      }
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
      console.error("Transcription error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTranscription = () => {
    setTranscription("");
    setError("");
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🎤 Whisper Transcribe</h1>
        <p className="subtitle">
          Record your voice and get instant transcription
        </p>

        <div className="recording-section">
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

          {isProcessing && (
            <div className="processing">
              <div className="spinner"></div>
              <p>Processing your audio...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="error">
            <p>❌ {error}</p>
          </div>
        )}

        {transcription && (
          <div className="transcription-section">
            <div className="transcription-header">
              <h3>📝 Transcription</h3>
              <button className="clear-button" onClick={clearTranscription}>
                Clear
              </button>
            </div>
            <div className="transcription-text">{transcription}</div>
          </div>
        )}

        <div className="instructions">
          <h3>How to use:</h3>
          <ol>
            <li>Click "Start Recording" to begin recording your voice</li>
            <li>Speak clearly into your microphone</li>
            <li>Click "Stop Recording" when you're done</li>
            <li>Wait for the transcription to appear below</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
