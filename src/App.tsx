import { useState, useRef } from "react";
import { FiCheck } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
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
  const [isCopied, setIsCopied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldProcessRef = useRef<boolean>(false);

  const startRecording = async () => {
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
    } catch (err) {
      setError(
        "Failed to start recording. Please check microphone permissions."
      );
      console.error("Recording error:", err);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
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
        // Auto-copy to clipboard
        try {
          await navigator.clipboard.writeText(result.transcription);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error("Failed to auto-copy to clipboard:", err);
        }
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const clearTranscription = () => {
    setTranscription("");
    setError("");
    setIsCopied(false);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🎤 Whisper Transcribe</h1>
        <p className="subtitle">
          Record your voice and get instant transcription
        </p>

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

        {error && (
          <div className="error">
            <p>❌ {error}</p>
          </div>
        )}

        {transcription && (
          <div className="transcription-section">
            <div className="transcription-header">
              <h3>📝 Transcription</h3>
              <div className="transcription-actions">
                <button
                  className={`copy-button ${isCopied ? "copied" : ""}`}
                  onClick={copyToClipboard}
                  title={isCopied ? "Copied!" : "Copy to clipboard"}
                >
                  {isCopied ? (
                    <FiCheck size={16} />
                  ) : (
                    <MdContentCopy size={16} />
                  )}
                </button>
                <button className="clear-button" onClick={clearTranscription}>
                  Clear
                </button>
              </div>
            </div>
            <textarea
              className="transcription-text"
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Transcription will appear here..."
              rows={4}
            />
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
