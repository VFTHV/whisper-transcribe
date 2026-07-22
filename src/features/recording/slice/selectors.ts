import type { RootState } from "../../../store";
import { PendingSource } from "./reducers";

export const selectIsRecording = (state: RootState) =>
  state.recording.isRecording;
export const selectIsPaused = (state: RootState) => state.recording.isPaused;
export const selectPendingSource = (state: RootState) =>
  state.recording.pendingSource;
export const selectPendingFileName = (state: RootState) =>
  state.recording.pendingFileName;
export const selectHasFailedAttempt = (state: RootState) =>
  state.recording.hasFailedAttempt;
export const selectIsUploadPending = (state: RootState) =>
  state.recording.pendingSource === PendingSource.Upload &&
  !state.recording.hasFailedAttempt;
