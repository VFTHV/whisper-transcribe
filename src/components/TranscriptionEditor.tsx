import React from "react";

interface TranscriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({
  value,
  onChange,
  placeholder = "Transcription will appear here...",
  rows = 4,
  className = "",
}) => {
  return (
    <textarea
      className={`transcription-text ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

export default TranscriptionEditor;
