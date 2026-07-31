export type TranscriptionModelMetadata = {
  id: string;
  label: string;
  description: string;
  pricePerMinuteUsd: number;
  supportsPrompt: boolean;
  recommended?: boolean;
};

// Single source of truth for available OpenAI transcription models.
// Served to the client via the `models` function and used to validate
// requests in the `transcribe` function.
export const TRANSCRIPTION_MODELS: TranscriptionModelMetadata[] = [
  {
    id: "whisper-1",
    label: "Whisper 1",
    description: "Legacy model. Supports timestamps.",
    pricePerMinuteUsd: 0.006,
    supportsPrompt: true,
  },
  {
    id: "gpt-4o-transcribe",
    label: "GPT-4o Transcribe",
    description: "Best accuracy.",
    pricePerMinuteUsd: 0.006,
    supportsPrompt: true,
    recommended: true,
  },
  {
    id: "gpt-4o-mini-transcribe",
    label: "GPT-4o Mini Transcribe",
    description: "Cost-optimized.",
    pricePerMinuteUsd: 0.003,
    supportsPrompt: true,
  },
  {
    id: "gpt-4o-transcribe-diarize",
    label: "GPT-4o Transcribe (Diarize)",
    description: "Speaker labels. Does not support a custom prompt.",
    pricePerMinuteUsd: 0.006,
    supportsPrompt: false,
  },
];
