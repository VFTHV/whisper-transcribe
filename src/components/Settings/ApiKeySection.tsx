import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  Link,
} from "@mui/material";

type Props = {
  setApiKey: (apiKey: string) => void;
  onSubmitted?: () => void;
};

const ApiKeySection = ({ setApiKey, onSubmitted }: Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  const handleSubmit = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      setIsSubmitted(true);
      setTempApiKey("");
      if (onSubmitted) {
        onSubmitted();
      }
    }
  };

  const handleReenter = () => {
    setIsSubmitted(false);
    setTempApiKey("");
    setApiKey("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" fontWeight={600}>
        OpenAI API Key
      </Typography>

      {!isSubmitted ? (
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <TextField
            type="password"
            placeholder="Enter your OpenAI API key (sk-...)"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!tempApiKey.trim()}
          >
            Submit
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={handleReenter}>
            Re-enter API Key
          </Button>
          <Typography variant="body2" color="success.main" fontWeight={600}>
            API key submitted and ready to use
          </Typography>
        </Box>
      )}

      <Typography variant="body2" color="text.secondary">
        Your API key is only sent to the server for processing and never stored.
      </Typography>

      <Link
        href="https://platform.openai.com/usage"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{
          display: "inline-flex",
          alignSelf: "flex-start",
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          px: 2,
          py: 1,
          bgcolor: "action.hover",
        }}
      >
        Check API Usage & Credits
      </Link>
    </Stack>
  );
};

export default ApiKeySection;
