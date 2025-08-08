export function AppHeader() {
  return (
    <>
      <h1>🎤 Whisper Transcribe</h1>
      <p className="subtitle">
        Record your voice and get instant transcription
      </p>
      <p className="hotkey-info">
        💡 Press <kbd>Ctrl+K</kbd> to start/stop recording (works even when tab
        is not active). Press <kbd>Escape</kbd> to cancel recording.
      </p>
    </>
  );
}
