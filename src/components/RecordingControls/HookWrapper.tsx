import { useHotkeys } from "react-hotkeys-hook";
import { useAppSelector } from "../../store/hooks";
import {
  selectIsPaused,
  selectIsRecording,
} from "../../features/recording/slice/selectors";
import { selectTranscribeAudioLoading } from "../../features/transcription/slice/command/transcribeAudio";
import { HOTKEYS } from "../../config/hotkeys";

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
  const isProcessing = useAppSelector(selectTranscribeAudioLoading);

  useHotkeys(
    HOTKEYS.toggleRecording.keys,
    (e) => {
      e.preventDefault();
      if (e.repeat || isProcessing) return;
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    HOTKEYS.cancelRecording.keys,
    (e) => {
      if (isRecording && !e.repeat) {
        e.preventDefault();
        cancelRecording();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    HOTKEYS.togglePause.keys,
    (e) => {
      // Space natively activates a focused button/link; don't double-fire.
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, [role='button']")) return;
      if (isRecording && !e.repeat) {
        e.preventDefault();
        if (isPaused) {
          resumeRecording();
        } else {
          pauseRecording();
        }
      }
    },
    {}
  );

  return null;
};

export default HookWrapper;
