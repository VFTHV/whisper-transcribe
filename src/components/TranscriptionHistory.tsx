import { useState } from "react";
import { FiCheck, FiCopy, FiTrash2 } from "react-icons/fi";
import {
  MIN_WORDS,
  STORED_TRANSCRIPTIONS,
  TranscriptionRecord,
} from "../utils/transcriptionStorage";

type Props = {
  transcriptions: TranscriptionRecord[];
  onDeleteTranscription: (id: string) => void;
};

const TranscriptionHistory = ({
  transcriptions,
  onDeleteTranscription,
}: Props) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  if (transcriptions.length === 0) {
    return (
      <div className="transcription-history">
        <h3>
          📜 Previous {STORED_TRANSCRIPTIONS} Transcriptions (minimum{" "}
          {MIN_WORDS} words)
        </h3>
        <p className="no-transcriptions">No previous transcriptions yet.</p>
      </div>
    );
  }

  return (
    <div className="transcription-history">
      <h3>
        📜 Previous {STORED_TRANSCRIPTIONS} Transcriptions (minimum {MIN_WORDS}{" "}
        words)
      </h3>
      <div className="transcription-list">
        {transcriptions.map((transcription) => (
          <div key={transcription.id} className="transcription-item">
            <div className="transcription-item-header">
              <div className="transcription-date">{transcription.date}</div>
              <div className="transcription-actions">
                <button
                  className={`copy-button ${
                    copiedId === transcription.id ? "copied" : ""
                  }`}
                  onClick={() =>
                    copyToClipboard(transcription.text, transcription.id)
                  }
                  title={
                    copiedId === transcription.id
                      ? "Copied!"
                      : "Copy to clipboard"
                  }
                >
                  {copiedId === transcription.id ? (
                    <FiCheck size={14} />
                  ) : (
                    <FiCopy size={14} />
                  )}
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDeleteTranscription(transcription.id)}
                  title="Delete transcription"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>

            <div className="transcription-text">{transcription.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionHistory;
