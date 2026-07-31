import { useEffect } from "react";
import { getApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { settingsActions } from "../../features/settings/slice/reducers";
import {
  selectModel,
  selectModelsStatus,
} from "../../features/settings/slice/selectors";
import { pickDefaultModel, type TranscriptionModelMetadata } from "./transcriptionModels";

type ModelsResponse = {
  models: TranscriptionModelMetadata[];
};

// Fetches the available transcription models (with pricing/description
// metadata) from the API and, if no model is selected yet or the previously
// selected one is no longer offered, defaults to the recommended/cheapest one.
export const useFetchTranscriptionModels = () => {
  const dispatch = useAppDispatch();
  const model = useAppSelector(selectModel);
  const modelsStatus = useAppSelector(selectModelsStatus);

  useEffect(() => {
    if (modelsStatus !== "idle") return;

    dispatch(settingsActions.fetchModelsStarted());

    fetch(getApiUrl(API_ENDPOINTS.MODELS))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<ModelsResponse>;
      })
      .then(({ models }) => {
        dispatch(settingsActions.fetchModelsSucceeded(models));

        const isCurrentModelAvailable = models.some((m) => m.id === model);
        if (!isCurrentModelAvailable) {
          const defaultModel = pickDefaultModel(models);
          if (defaultModel) {
            dispatch(settingsActions.setModel(defaultModel.id));
          }
        }
      })
      .catch((err) => {
        dispatch(
          settingsActions.fetchModelsFailed(
            "Failed to load transcription models."
          )
        );
        console.error("Failed to fetch transcription models:", err);
      });
  }, [dispatch, model, modelsStatus]);
};
