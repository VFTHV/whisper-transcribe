import { useEffect } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import Settings from "../components/Settings";
import TranscriptionEditor from "../components/TranscriptionEditor";
import RecordingControls from "../components/RecordingControls";
import TranscriptionActions from "../components/TranscriptionActions";
import ErrorDisplay from "../components/ErrorDisplay";
import TranscriptionHistory from "../components/TranscriptionHistory";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { transcriptionActions } from "../features/transcription/slice/reducers";
import { selectTranscriptionText } from "../features/transcription/slice/selectors";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const transcription = useAppSelector(selectTranscriptionText);

  useEffect(() => {
    dispatch(transcriptionActions.hydrateHistory());
  }, [dispatch]);

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 2 },
        pt: { xs: 5, sm: 6 },
        pb: { xs: 5, sm: 6 },
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: { xs: 0, sm: 3 },
            border: { xs: "none", sm: "1px solid" },
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Settings />

          <RecordingControls />

          <ErrorDisplay />

          {transcription && (
            <Box
              sx={{
                bgcolor: "surfaceContainer.low",
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
                <TranscriptionActions />
              </Box>
              <TranscriptionEditor />
            </Box>
          )}

          <TranscriptionHistory />
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
