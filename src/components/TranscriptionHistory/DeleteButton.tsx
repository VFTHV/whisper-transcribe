import { useCallback } from "react";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { transcriptionActions } from "../../features/transcription/slice/reducers";

type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(transcriptionActions.removeTranscription(id));
  }, [dispatch, id]);

  return (
    <IconButton
      size="small"
      onClick={handleDelete}
      title="Delete transcription"
      color="error"
    >
      <Delete fontSize="small" />
    </IconButton>
  );
};

export default DeleteButton;
