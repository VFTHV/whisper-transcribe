import type { RootState } from "../../../store";

export const selectApiKey = (state: RootState) => state.settings.apiKey;
export const selectModel = (state: RootState) => state.settings.model;
