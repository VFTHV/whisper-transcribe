import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const PendingSource = {
  Upload: "upload",
  Recording: "recording",
} as const;

export type PendingSource =
  (typeof PendingSource)[keyof typeof PendingSource];

export type RecordingState = {
  isRecording: boolean;
  isPaused: boolean;
  pendingSource: PendingSource | null;
  pendingFileName: string;
  hasFailedAttempt: boolean;
};

type PreservePendingPayload = {
  fileName: string;
  source: PendingSource;
};

type SetPendingUploadPayload = {
  fileName: string;
};

const initialState: RecordingState = {
  isRecording: false,
  isPaused: false,
  pendingSource: null,
  pendingFileName: "",
  hasFailedAttempt: false,
};

const recordingSlice = createSlice({
  name: "recording",
  initialState,
  reducers: {
    recordingStarted: (state) => {
      state.isRecording = true;
      state.isPaused = false;
    },
    recordingStopped: (state) => {
      state.isRecording = false;
      state.isPaused = false;
    },
    recordingPaused: (state) => {
      state.isPaused = true;
    },
    recordingResumed: (state) => {
      state.isPaused = false;
    },
    recordingCancelled: (state) => {
      state.isRecording = false;
      state.isPaused = false;
    },
    setPendingUpload: (
      state,
      action: PayloadAction<SetPendingUploadPayload>
    ) => {
      state.pendingSource = PendingSource.Upload;
      state.pendingFileName = action.payload.fileName;
      state.hasFailedAttempt = false;
    },
    preservePending: (
      state,
      action: PayloadAction<PreservePendingPayload>
    ) => {
      state.pendingFileName = action.payload.fileName;
      state.pendingSource = action.payload.source;
      state.hasFailedAttempt = true;
    },
    clearPending: (state) => {
      state.pendingSource = null;
      state.pendingFileName = "";
      state.hasFailedAttempt = false;
    },
  },
});

export const recordingActions = recordingSlice.actions;
export const recordingReducer = recordingSlice.reducer;
