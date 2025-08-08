import { useState } from "react";
import {
  TranscriptionEditor,
  Instructions,
  RecordingControls,
  TranscriptionActions,
} from "./components";
import "./App.css";

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleTranscriptionComplete = async (newTranscription: string) => {
    setTranscription(newTranscription);
    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(newTranscription);
    } catch (err) {
      console.error("Failed to auto-copy to clipboard:", err);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
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
              <TranscriptionActions
                transcription={transcription}
                onClear={clearTranscription}
              />
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
