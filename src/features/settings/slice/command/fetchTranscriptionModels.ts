import { createAsyncAction } from "async-selector-kit";
import type { RootState } from "../../../../store";
import { getApiUrl, API_ENDPOINTS } from "../../../../utils/apiConfig";
import {
  pickDefaultModel,
  type TranscriptionModelMetadata,
} from "../../../../components/Settings/transcriptionModels";
import { selectApiKey, selectModel } from "../selectors";
import { settingsActions } from "../reducers";

type ModelsResponse = {
  models: TranscriptionModelMetadata[];
};

// Fetches the transcription models available to the user (with pricing and
// description metadata) and, if no model is selected yet or the previously
// selected one is no longer offered, defaults to the recommended/cheapest one.
export const [
  fetchTranscriptionModels,
  selectFetchTranscriptionModelsLoading,
  selectFetchTranscriptionModelsError,
] = createAsyncAction<RootState, void, string, string>(
  {
    id: "fetchTranscriptionModels",
    async: (store, _status, apiKey, model) => async () => {
      const response = await fetch(getApiUrl(API_ENDPOINTS.MODELS), {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { models } = (await response.json()) as ModelsResponse;
      store.dispatch(settingsActions.setModels(models));

      const isCurrentModelAvailable = models.some((m) => m.id === model);
      if (!isCurrentModelAvailable) {
        const defaultModel = pickDefaultModel(models);
        if (defaultModel) {
          store.dispatch(settingsActions.setModel(defaultModel.id));
        }
      }
    },
  },
  [selectApiKey, selectModel]
);
