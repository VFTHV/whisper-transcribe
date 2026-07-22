import { Button, IconButton, Box } from "@mui/material";
import { Check, ContentCopy } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { transcriptionActions } from "../features/transcription/slice/reducers";
import {
  selectIsCopied,
  selectTranscriptionText,
} from "../features/transcription/slice/selectors";

const TranscriptionActions = () => {
  const dispatch = useAppDispatch();
  const transcription = useAppSelector(selectTranscriptionText);
  const isCopied = useAppSelector(selectIsCopied);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      dispatch(transcriptionActions.setIsCopied(true));
      setTimeout(() => {
        dispatch(transcriptionActions.setIsCopied(false));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <IconButton
        onClick={copyToClipboard}
        color={isCopied ? "success" : "default"}
        title={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        {isCopied ? <Check /> : <ContentCopy />}
      </IconButton>
      <Button
        variant="outlined"
        onClick={() => dispatch(transcriptionActions.clearTranscription())}
      >
        Clear
      </Button>
    </Box>
  );
};

export default TranscriptionActions;
