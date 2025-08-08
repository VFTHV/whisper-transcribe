type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TranscriptionEditor = ({
  value,
  onChange,
  placeholder = "Transcription will appear here...",
}: Props) => {
  return (
    <textarea
      className="transcription-text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default TranscriptionEditor;
