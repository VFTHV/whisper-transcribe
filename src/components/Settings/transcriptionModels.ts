export type TranscriptionModelId = string;

export type TranscriptionModelMetadata = {
  id: TranscriptionModelId;
  label: string;
  description: string;
  pricePerMinuteUsd: number;
  supportsPrompt: boolean;
  recommended?: boolean;
};

// Picks the model to default to when none is selected yet, or when the
// previously selected model is no longer in the fetched list: the model
// explicitly marked as recommended by the metadata, otherwise the cheapest one.
export const pickDefaultModel = (
  models: TranscriptionModelMetadata[]
): TranscriptionModelMetadata | undefined => {
  if (models.length === 0) return undefined;

  return (
    models.find((model) => model.recommended) ??
    models.reduce((cheapest, model) =>
      model.pricePerMinuteUsd < cheapest.pricePerMinuteUsd ? model : cheapest
    )
  );
};
