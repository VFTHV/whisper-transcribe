import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Check, ContentCopy, Delete } from "@mui/icons-material";
import {
  MIN_WORDS,
  STORED_TRANSCRIPTIONS,
} from "../utils/transcriptionStorage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { transcriptionActions } from "../features/transcription/slice/reducers";
import { selectTranscriptionHistory } from "../features/transcription/slice/selectors";

const TranscriptionHistory = () => {
  const dispatch = useAppDispatch();
  const transcriptions = useAppSelector(selectTranscriptionHistory);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  if (transcriptions.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight={600} textAlign="center">
          Previous {STORED_TRANSCRIPTIONS} Transcriptions (minimum {MIN_WORDS}{" "}
          words)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ py: 2, fontStyle: "italic" }}
        >
          No previous transcriptions yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        textAlign="center"
        sx={{ mb: 1 }}
      >
        Previous {STORED_TRANSCRIPTIONS} Transcriptions (minimum {MIN_WORDS}{" "}
        words)
      </Typography>
      <List
        sx={{
          maxHeight: 300,
          overflow: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "surfaceContainer.low",
          py: 0,
        }}
      >
        {transcriptions.map((transcription) => (
          <ListItem
            key={transcription.id}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              flexDirection: "column",
              alignItems: "stretch",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {transcription.date}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    copyToClipboard(transcription.text, transcription.id)
                  }
                  color={copiedId === transcription.id ? "success" : "default"}
                  title={
                    copiedId === transcription.id
                      ? "Copied!"
                      : "Copy to clipboard"
                  }
                >
                  {copiedId === transcription.id ? (
                    <Check fontSize="small" />
                  ) : (
                    <ContentCopy fontSize="small" />
                  )}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      transcriptionActions.removeTranscription(transcription.id)
                    )
                  }
                  title="Delete transcription"
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <ListItemText
              primary={transcription.text}
              primaryTypographyProps={{
                variant: "body2",
                sx: { wordBreak: "break-word" },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TranscriptionHistory;
