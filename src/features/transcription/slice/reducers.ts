import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  deleteTranscription,
  getTranscriptions,
  saveTranscription,
  type TranscriptionRecord,
} from "../../../utils/transcriptionStorage";

export type TranscriptionState = {
  text: string;
  history: TranscriptionRecord[];
  error: string;
  isCopied: boolean;
};

const initialState: TranscriptionState = {
  text: "",
  history: [],
  error: "",
  isCopied: false,
};

const transcriptionSlice = createSlice({
  name: "transcription",
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    clearTranscription: (state) => {
      state.text = "";
      state.error = "";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setIsCopied: (state, action: PayloadAction<boolean>) => {
      state.isCopied = action.payload;
    },
    hydrateHistory: (state) => {
      state.history = getTranscriptions();
    },
    addTranscription: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
      const savedRecord = saveTranscription(action.payload);
      if (savedRecord) {
        state.history = [savedRecord, ...state.history];
      }
    },
    removeTranscription: (state, action: PayloadAction<string>) => {
      deleteTranscription(action.payload);
      state.history = state.history.filter((t) => t.id !== action.payload);
    },
  },
});

export const transcriptionActions = transcriptionSlice.actions;
export const transcriptionReducer = transcriptionSlice.reducer;
