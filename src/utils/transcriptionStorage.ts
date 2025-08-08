export type TranscriptionRecord = {
  id: string;
  text: string;
  timestamp: number;
  date: string;
};

const STORAGE_KEY = "whisper-transcriptions";

export const saveTranscription = (text: string): TranscriptionRecord => {
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTranscriptions));

  return newRecord;
};

export const getTranscriptions = (): TranscriptionRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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
