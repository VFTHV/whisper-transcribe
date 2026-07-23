import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TranscriptionModelId } from "../../../components/Settings/transcriptionModels";

export type SettingsState = {
  apiKey: string;
  model: TranscriptionModelId;
  prompt: string;
};

const initialState: SettingsState = {
  apiKey: "",
  model: "whisper-1",
  prompt: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setModel: (state, action: PayloadAction<TranscriptionModelId>) => {
      state.model = action.payload;
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
