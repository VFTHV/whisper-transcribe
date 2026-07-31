import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  TranscriptionModelId,
  TranscriptionModelMetadata,
} from "../../../components/Settings/transcriptionModels";

export type SettingsState = {
  apiKey: string;
  model: TranscriptionModelId;
  prompt: string;
  models: TranscriptionModelMetadata[];
};

const initialState: SettingsState = {
  apiKey: "",
  model: "",
  prompt: "",
  models: [],
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
    setModels: (state, action: PayloadAction<TranscriptionModelMetadata[]>) => {
      state.models = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
