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

  // Space: start recording, or pause/resume while recording.
  useHotkeys(HOTKEYS.startOrPause.keys, (e) => {
    // Always block the browser default so Space never scrolls the page.
    e.preventDefault();
    // Drop focus from a focused button/link so the browser's own Space
    // "click" on keyup doesn't fire a second action.
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, [role='button']")) target.blur();
    if (e.repeat || isProcessing) return;

    if (!isRecording) {
      startRecording();
    } else if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  });

  // Enter: finish the recording and transcribe it.
  useHotkeys(HOTKEYS.finishRecording.keys, (e) => {
    if (!isRecording) return;
    // Stops Enter from also clicking a focused button.
    e.preventDefault();
    if (!e.repeat) stopRecording();
  });

  // Escape: cancel the recording.
  useHotkeys(
    HOTKEYS.cancelRecording.keys,
    (e) => {
      if (isRecording) {
        e.preventDefault();
        if (!e.repeat) cancelRecording();
      }
    },
    { enableOnFormTags: true }
  );

  return null;
};

export default HookWrapper;
