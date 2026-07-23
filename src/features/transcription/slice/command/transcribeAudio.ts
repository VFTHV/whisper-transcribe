import { createAsyncAction } from "async-selector-kit";
import type { RootState } from "../../../../store";
import { getApiUrl, API_ENDPOINTS } from "../../../../utils/apiConfig";
import {
  selectApiKey,
  selectModel,
  selectPrompt,
} from "../../../settings/slice/selectors";
import { transcriptionActions } from "../reducers";

type Params = {
  audioBlob: Blob;
  fileName: string;
};

type TranscribeResponse = {
  success: boolean;
  transcription?: string;
  error?: string;
};

export const [
  transcribeAudio,
  selectTranscribeAudioLoading,
  selectTranscribeAudioError,
] = createAsyncAction<RootState, void, Params, string, string, string>(
  {
    id: "transcribeAudio",
    async:
      (store, _status, apiKey, model, prompt) =>
      async ({ audioBlob, fileName }) => {
        store.dispatch(transcriptionActions.setError(""));

        const formData = new FormData();
        formData.append("audio", audioBlob, fileName);
        formData.append("apiKey", apiKey);
        formData.append("model", model);
        formData.append("prompt", prompt);

        let response: Response;
        try {
          response = await fetch(getApiUrl(API_ENDPOINTS.TRANSCRIBE), {
            method: "POST",
            body: formData,
          });
        } catch (err) {
          store.dispatch(
            transcriptionActions.setError(
              "Failed to transcribe audio. Please try again."
            )
          );
          console.error("Transcription error:", err);
          throw err;
        }

        if (!response.ok) {
          store.dispatch(
            transcriptionActions.setError(
              "Failed to transcribe audio. Please try again."
            )
          );
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = (await response.json()) as TranscribeResponse;

        if (!result.success || !result.transcription) {
          const message = result.error || "Transcription failed";
          store.dispatch(transcriptionActions.setError(message));
          throw new Error(message);
        }

        store.dispatch(
          transcriptionActions.addTranscription(result.transcription)
        );

        try {
          await navigator.clipboard.writeText(result.transcription);
          store.dispatch(transcriptionActions.setIsCopied(true));
          setTimeout(() => {
            store.dispatch(transcriptionActions.setIsCopied(false));
          }, 2000);
        } catch (err) {
          console.error("Failed to auto-copy to clipboard:", err);
        }
      },
  },
  [selectApiKey, selectModel, selectPrompt]
);
