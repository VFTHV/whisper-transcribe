import { TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { transcriptionActions } from "../features/transcription/slice/reducers";
import { selectTranscriptionText } from "../features/transcription/slice/selectors";

type Props = {
  placeholder?: string;
};

const TranscriptionEditor = ({
  placeholder = "Transcription will appear here...",
}: Props) => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectTranscriptionText);

  return (
    <TextField
      multiline
      fullWidth
      minRows={4}
      value={value}
      onChange={(e) => dispatch(transcriptionActions.setText(e.target.value))}
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
