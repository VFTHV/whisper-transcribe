import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const HeaderAccordion = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="header-accordion">
      {/* Main Header - Always Visible */}
      <div className="header-main">
        <h1>🎤 Whisper Transcribe</h1>
        <p className="subtitle">
          Record your voice and get instant transcription
        </p>

        {/* Accordion Toggle Button */}
        <button
          className="accordion-toggle"
          onClick={toggleAccordion}
          aria-expanded={isExpanded}
          aria-controls="accordion-content"
        >
          <span>{isExpanded ? "Hide" : "Show"} Instructions & Shortcuts</span>
          {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div
        id="accordion-content"
        className={`accordion-content ${isExpanded ? "expanded" : "collapsed"}`}
      >
        <div className="accordion-inner">
          {/* Hotkey Info */}
          <div className="hotkey-section">
            <p className="hotkey-info">
              💡 Press <kbd>Ctrl+K</kbd> to start/stop recording (works even
              when tab is not active). Press <kbd>Space</kbd> to pause/resume
              recording. Press <kbd>Escape</kbd> to cancel recording.
            </p>
          </div>

          {/* Instructions */}
          <div className="instructions-section">
            <h3>How to use:</h3>
            <ol>
              <li>Click "Start Recording" to begin recording your voice</li>
              <li>Speak clearly into your microphone</li>
              <li>Click "Stop Recording" when you're done</li>
              <li>Wait for the transcription to appear below</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAccordion;
