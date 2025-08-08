import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TranscriptionEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Transcription will appear here...",
}) => {
  return (
    <textarea
      className="transcription-text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
    />
  );
};

export default TranscriptionEditor;
