import { Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

type Props = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

const ErrorDisplay = ({ error, setError }: Props) => {
  if (!error) return null;

  return (
    <Alert
      severity="error"
      action={
        <IconButton size="small" onClick={() => setError("")} title="Close error">
          <Close fontSize="small" />
        </IconButton>
      }
    >
      {error}
    </Alert>
  );
};

export default ErrorDisplay;
