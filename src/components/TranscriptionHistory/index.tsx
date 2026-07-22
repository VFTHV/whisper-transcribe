import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  MIN_WORDS,
  STORED_TRANSCRIPTIONS,
} from "../../utils/transcriptionStorage";
import { useAppSelector } from "../../store/hooks";
import { selectTranscriptionHistory } from "../../features/transcription/slice/selectors";
import CopyButton from "./CopyButton";
import DeleteButton from "./DeleteButton";

const TranscriptionHistory = () => {
  const transcriptions = useAppSelector(selectTranscriptionHistory);

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
                <CopyButton text={transcription.text} />
                <DeleteButton id={transcription.id} />
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
