import type { RootState } from "../../../store";

export const selectTranscriptionText = (state: RootState) =>
  state.transcription.text;
export const selectTranscriptionHistory = (state: RootState) =>
  state.transcription.history;
export const selectTranscriptionError = (state: RootState) =>
  state.transcription.error;
export const selectIsCopied = (state: RootState) =>
  state.transcription.isCopied;
