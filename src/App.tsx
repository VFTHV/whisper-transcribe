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
  const [isCopied, setIsCopied] = useState(false);

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
          setTranscription={setTranscription}
          onError={handleError}
          setIsCopied={setIsCopied}
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
                isCopied={isCopied}
                setIsCopied={setIsCopied}
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
