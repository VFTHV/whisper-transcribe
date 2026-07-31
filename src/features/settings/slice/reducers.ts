import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  TranscriptionModelId,
  TranscriptionModelMetadata,
} from "../../../components/Settings/transcriptionModels";

export type ModelsStatus = "idle" | "loading" | "succeeded" | "failed";

export type SettingsState = {
  apiKey: string;
  model: TranscriptionModelId;
  prompt: string;
  models: TranscriptionModelMetadata[];
  modelsStatus: ModelsStatus;
  modelsError: string;
};

const initialState: SettingsState = {
  apiKey: "",
  model: "",
  prompt: "",
  models: [],
  modelsStatus: "idle",
  modelsError: "",
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
    fetchModelsStarted: (state) => {
      state.modelsStatus = "loading";
      state.modelsError = "";
    },
    fetchModelsSucceeded: (
      state,
      action: PayloadAction<TranscriptionModelMetadata[]>
    ) => {
      state.modelsStatus = "succeeded";
      state.models = action.payload;
    },
    fetchModelsFailed: (state, action: PayloadAction<string>) => {
      state.modelsStatus = "failed";
      state.modelsError = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
