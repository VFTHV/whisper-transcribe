import { TextField } from "@mui/material";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TranscriptionEditor = ({
  value,
  onChange,
  placeholder = "Transcription will appear here...",
}: Props) => {
  return (
    <TextField
      multiline
      fullWidth
      minRows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: "background.paper",
        },
      }}
    />
  );
};

export default TranscriptionEditor;
