export type TranscriptionRecord = {
  id: string;
  text: string;
  timestamp: number;
  date: string;
};

const STORAGE_KEY = "whisper-transcriptions";
export const MIN_WORDS = 5;
export const STORED_TRANSCRIPTIONS = 100;

export const saveTranscription = (text: string): TranscriptionRecord | null => {
  // Check if text has at least 10 words
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  if (wordCount < MIN_WORDS) {
    console.log(
      `Transcription not saved: only ${wordCount} words (minimum ${MIN_WORDS} required)`
    );
    return null;
  }

  const timestamp = Date.now();
  const date = new Date(timestamp).toLocaleString();
  const id = `transcription-${timestamp}`;

  const newRecord: TranscriptionRecord = {
    id,
    text,
    timestamp,
    date,
  };

  const existingTranscriptions = getTranscriptions();
  const updatedTranscriptions = [newRecord, ...existingTranscriptions];

  // Limit to maximum 100 items
  const limitedTranscriptions = updatedTranscriptions.slice(0, 100);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedTranscriptions));

  return newRecord;
};

export const getTranscriptions = (): TranscriptionRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const transcriptions = stored ? JSON.parse(stored) : [];

    // Ensure we don't have more than 100 items (cleanup for existing storage)
    if (transcriptions.length > STORED_TRANSCRIPTIONS) {
      const limitedTranscriptions = transcriptions.slice(
        0,
        STORED_TRANSCRIPTIONS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedTranscriptions));
      return limitedTranscriptions;
    }

    return transcriptions;
  } catch (error) {
    console.error("Error loading transcriptions:", error);
    return [];
  }
};

export const deleteTranscription = (id: string): void => {
  const existingTranscriptions = getTranscriptions();
  const filteredTranscriptions = existingTranscriptions.filter(
    (t) => t.id !== id
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTranscriptions));
};

export const clearAllTranscriptions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
