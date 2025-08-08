import { useState } from "react";
import {
  TranscriptionEditor,
  Instructions,
  RecordingControls,
  TranscriptionActions,
  ErrorDisplay,
  AppHeader,
} from "./components";
import "./App.css";

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  const handleTranscriptionComplete = async (newTranscription: string) => {
    setTranscription(newTranscription);
    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(newTranscription);
      // Show copied feedback
      setShowCopiedFeedback(true);
      setTimeout(() => setShowCopiedFeedback(false), 100); // Brief trigger
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
    setShowCopiedFeedback(false);
  };

  return (
    <div className="app">
      <div className="container">
        <AppHeader />

        <RecordingControls
          onTranscriptionComplete={handleTranscriptionComplete}
          onError={handleError}
        />

        <ErrorDisplay error={error} />

        {transcription && (
          <div className="transcription-section">
            <div className="transcription-header">
              <h3>📝 Transcription</h3>
              <TranscriptionActions
                transcription={transcription}
                onClear={clearTranscription}
                showCopiedFeedback={showCopiedFeedback}
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
