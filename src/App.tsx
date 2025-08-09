import { useState, useEffect } from "react";
import ApiKeyAccordion from "./components/ApiKeyAccordion";
import TranscriptionEditor from "./components/TranscriptionEditor";
import RecordingControls from "./components/RecordingControls";
import TranscriptionActions from "./components/TranscriptionActions";
import ErrorDisplay from "./components/ErrorDisplay";
import TranscriptionHistory from "./components/TranscriptionHistory";
import HeaderAccordion from "./components/HeaderAccordion";
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

        <ApiKeyAccordion setApiKey={setApiKey} />

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
