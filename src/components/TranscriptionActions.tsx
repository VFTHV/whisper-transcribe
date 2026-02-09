import { Button, IconButton, Box } from "@mui/material";
import { Check, ContentCopy } from "@mui/icons-material";

type Props = {
  transcription: string;
  onClear: () => void;
  isCopied: boolean;
  setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
};

const TranscriptionActions = ({
  transcription,
  onClear,
  isCopied,
  setIsCopied,
}: Props) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
      <Button variant="outlined" onClick={onClear}>
        Clear
      </Button>
    </Box>
  );
};

export default TranscriptionActions;
