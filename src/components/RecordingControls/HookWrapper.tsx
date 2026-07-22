import { useHotkeys } from "react-hotkeys-hook";
import { useAppSelector } from "../../store/hooks";
import {
  selectIsPaused,
  selectIsRecording,
} from "../../features/recording/slice/selectors";

type Props = {
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
};

const HookWrapper = ({
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  cancelRecording,
}: Props) => {
  const isRecording = useAppSelector(selectIsRecording);
  const isPaused = useAppSelector(selectIsPaused);

  useHotkeys(
    "ctrl+k",
    (e) => {
      e.preventDefault();
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "escape",
    (e) => {
      if (isRecording) {
        e.preventDefault();
        cancelRecording();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "space",
    (e) => {
      if (isRecording) {
        e.preventDefault();
        if (isPaused) {
          resumeRecording();
        } else {
          pauseRecording();
        }
      }
    },
    { enableOnFormTags: true }
  );

  return null;
};

export default HookWrapper;
