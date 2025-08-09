import { useState } from "react";
import "./ApiKeyInput.css";

type Props = {
  setApiKey: (apiKey: string) => void;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const ApiKeyInput = ({ setApiKey, setIsExpanded }: Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  const handleSubmit = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      setIsSubmitted(true);
      setTempApiKey(""); // Clear temp input for security
      setTimeout(() => setIsExpanded(false), 1000);
    }
  };

  const handleReenter = () => {
    setIsSubmitted(false);
    setTempApiKey("");
    setApiKey(""); // Clear the stored API key
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="api-key-section">
      <h3>🔑 OpenAI API Key</h3>

      {!isSubmitted ? (
        <div className="api-key-input-container">
          <input
            type="password"
            placeholder="Enter your OpenAI API key (sk-...)"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            onKeyPress={handleKeyPress}
            className="api-key-input"
          />
          <button
            onClick={handleSubmit}
            disabled={!tempApiKey.trim()}
            className="api-key-submit-btn"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="api-key-submitted">
          <button onClick={handleReenter} className="api-key-reenter-btn">
            Re-enter API Key
          </button>
          <p className="api-key-status">
            ✅ API key submitted and ready to use
          </p>
        </div>
      )}

      <p className="api-key-help">
        Your API key is only sent to the server for processing and never stored.
      </p>

      <div>
        <a
          href="https://platform.openai.com/usage"
          target="_blank"
          rel="noopener noreferrer"
          className="usage-link"
        >
          Check API Usage & Credits
        </a>
      </div>
    </div>
  );
};

export default ApiKeyInput;
