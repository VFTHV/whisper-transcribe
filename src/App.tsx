import { useState, useEffect } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import Settings from "./components/Settings";
import type { TranscriptionModelId } from "./components/Settings/transcriptionModels";
import TranscriptionEditor from "./components/TranscriptionEditor";
import RecordingControls from "./components/RecordingControls";
import TranscriptionActions from "./components/TranscriptionActions";
import ErrorDisplay from "./components/ErrorDisplay";
import TranscriptionHistory from "./components/TranscriptionHistory";
import {
  saveTranscription,
  getTranscriptions,
  deleteTranscription,
  TranscriptionRecord,
} from "./utils/transcriptionStorage";

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<TranscriptionModelId>("whisper-1");
  const [transcriptionHistory, setTranscriptionHistory] = useState<
    TranscriptionRecord[]
  >([]);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const history = getTranscriptions();
    setTranscriptionHistory(history);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleNewTranscription = (newTranscription: string) => {
    setTranscription(newTranscription);
    const savedRecord = saveTranscription(newTranscription);
    if (savedRecord) {
      setTranscriptionHistory((prev) => [savedRecord, ...prev]);
    }
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
    <Box
      sx={{
        p: { xs: 0, sm: 2 },
        pt: { xs: 5, sm: 6 },
      }}
    >
      {!isOnline && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            py: 1,
            px: 2,
            bgcolor: "warning.main",
            color: "warning.contrastText",
            textAlign: "center",
            zIndex: 1300,
          }}
        >
          <Typography variant="body2">
            You're offline. Transcription requires an internet connection.
          </Typography>
        </Box>
      )}
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: { xs: 0, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Settings setApiKey={setApiKey} model={model} setModel={setModel} />

          <RecordingControls
            setTranscription={handleNewTranscription}
            setError={setError}
            setIsCopied={setIsCopied}
            apiKey={apiKey}
            model={model}
          />

          <ErrorDisplay error={error} setError={setError} />

          {transcription && (
            <Box
              sx={{
                bgcolor: "action.hover",
                borderRadius: 2,
                p: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Transcription</Typography>
                <TranscriptionActions
                  transcription={transcription}
                  onClear={clearTranscription}
                  isCopied={isCopied}
                  setIsCopied={setIsCopied}
                />
              </Box>
              <TranscriptionEditor
                value={transcription}
                onChange={setTranscription}
              />
            </Box>
          )}

          <TranscriptionHistory
            transcriptions={transcriptionHistory}
            onDeleteTranscription={handleDeleteTranscription}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
