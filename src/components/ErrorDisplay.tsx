import { Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { transcriptionActions } from "../features/transcription/slice/reducers";
import { selectTranscriptionError } from "../features/transcription/slice/selectors";

const ErrorDisplay = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectTranscriptionError);

  if (!error) return null;

  return (
    <Alert
      severity="error"
      action={
        <IconButton
          size="small"
          onClick={() => dispatch(transcriptionActions.setError(""))}
          title="Close error"
        >
          <Close fontSize="small" />
        </IconButton>
      }
    >
      {error}
    </Alert>
  );
};

export default ErrorDisplay;
