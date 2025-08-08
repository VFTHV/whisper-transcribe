import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";

type Props = {
  transcription: string;
  onClear: () => void;
};

export function TranscriptionActions({ transcription, onClear }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="transcription-actions">
      <button
        className={`copy-button ${isCopied ? "copied" : ""}`}
        onClick={copyToClipboard}
        title={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        {isCopied ? <FiCheck size={16} /> : <MdContentCopy size={16} />}
      </button>
      <button className="clear-button" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
