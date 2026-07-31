import type { RootState } from "../../../store";

export const selectApiKey = (state: RootState) => state.settings.apiKey;
export const selectModel = (state: RootState) => state.settings.model;
export const selectPrompt = (state: RootState) => state.settings.prompt;
export const selectModels = (state: RootState) => state.settings.models;
export const selectModelsStatus = (state: RootState) =>
  state.settings.modelsStatus;
export const selectModelsError = (state: RootState) =>
  state.settings.modelsError;
