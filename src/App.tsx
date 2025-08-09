import { useState, useEffect } from "react";
import {
  TranscriptionEditor,
  RecordingControls,
  TranscriptionActions,
  ErrorDisplay,
  TranscriptionHistory,
  HeaderAccordion,
} from "./components";
import {
  saveTranscription,
  getTranscriptions,
  deleteTranscription,
  TranscriptionRecord,
} from "./utils/transcriptionStorage";
import "./App.css";

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [transcriptionHistory, setTranscriptionHistory] = useState<
    TranscriptionRecord[]
  >([]);

  // Load transcription history on component mount
  useEffect(() => {
    const history = getTranscriptions();
    setTranscriptionHistory(history);
  }, []);

  const handleNewTranscription = (newTranscription: string) => {
    setTranscription(newTranscription);

    // Save to history
    const savedRecord = saveTranscription(newTranscription);
    setTranscriptionHistory((prev) => [savedRecord, ...prev]);
  };

  const handleDeleteTranscription = (id: string) => {
    deleteTranscription(id);
    setTranscriptionHistory((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTranscription = () => {
    setTranscription("");
    setError("");
  };

  return (
    <div className="app">
      <div className="container">
        <HeaderAccordion />

        {/* API Key Input */}
        <div className="api-key-section">
          <h3>🔑 OpenAI API Key</h3>
          <input
            type="password"
            placeholder="Enter your OpenAI API key (sk-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-key-input"
          />
          <p className="api-key-help">
            Your API key is only sent to the server for processing and never
            stored.
          </p>
        </div>

        <RecordingControls
          setTranscription={handleNewTranscription}
          setError={setError}
          setIsCopied={setIsCopied}
          apiKey={apiKey}
        />

        <ErrorDisplay error={error} />

        {transcription && (
          <div className="transcription-section">
            <div className="transcription-header">
              <h3>📝 Transcription</h3>
              <TranscriptionActions
                transcription={transcription}
                onClear={clearTranscription}
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

        <TranscriptionHistory
          transcriptions={transcriptionHistory}
          onDeleteTranscription={handleDeleteTranscription}
        />
      </div>
    </div>
  );
}

export default App;
