import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  isRecording: boolean;
  isPaused: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
};

const HookWrapper = ({
  isRecording,
  isPaused,
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  cancelRecording,
}: Props) => {
  // Global hotkey for recording
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

  // Escape key to cancel recording
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

  // Spacebar to pause/resume recording
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
