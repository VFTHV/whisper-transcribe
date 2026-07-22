import { useCallback, useState } from "react";
import { IconButton } from "@mui/material";
import { Check, ContentCopy } from "@mui/icons-material";

type Props = {
  text: string;
};

const CopyButton = ({ text }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, [text]);

  return (
    <IconButton
      size="small"
      onClick={() => {
        void handleCopy();
      }}
      color={copied ? "success" : "default"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
    </IconButton>
  );
};

export default CopyButton;
