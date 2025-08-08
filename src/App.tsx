import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import {
  TranscriptionEditor,
  Instructions,
  RecordingControls,
} from "./components";
import "./App.css";

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const handleTranscriptionComplete = async (newTranscription: string) => {
    setTranscription(newTranscription);
    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(newTranscription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to auto-copy to clipboard:", err);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
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
        <p className="hotkey-info">
          💡 Press <kbd>Ctrl+K</kbd> to start/stop recording (works even when
          tab is not active). Press <kbd>Escape</kbd> to cancel recording.
        </p>

        <RecordingControls
          onTranscriptionComplete={handleTranscriptionComplete}
          onError={handleError}
        />

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
            <TranscriptionEditor
              value={transcription}
              onChange={setTranscription}
            />
          </div>
        )}

        <Instructions />
      </div>
    </div>
  );
}

export default App;
