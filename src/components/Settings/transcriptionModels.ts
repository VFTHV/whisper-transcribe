export const TRANSCRIPTION_MODEL_IDS = [
  "whisper-1",
  "gpt-4o-transcribe",
  "gpt-4o-mini-transcribe",
  "gpt-4o-transcribe-diarize",
] as const;

export type TranscriptionModelId = (typeof TRANSCRIPTION_MODEL_IDS)[number];

export const TRANSCRIPTION_MODEL_LABELS: Record<TranscriptionModelId, string> = {
  "whisper-1": "Whisper 1",
  "gpt-4o-transcribe": "GPT-4o Transcribe",
  "gpt-4o-mini-transcribe": "GPT-4o Mini Transcribe",
  "gpt-4o-transcribe-diarize": "GPT-4o Transcribe (Diarize)",
};

export const TRANSCRIPTION_MODEL_DESCRIPTIONS: Record<
  TranscriptionModelId,
  string
> = {
  "whisper-1": "$0.006/min · Legacy, supports timestamps",
  "gpt-4o-transcribe": "$0.006/min · Best accuracy",
  "gpt-4o-mini-transcribe": "$0.003/min · Cost-optimized",
  "gpt-4o-transcribe-diarize": "$0.006/min · Speaker labels",
};
