import { useState } from "react";
import "./ApiKeyInput.css";

type Props = {
  setApiKey: (apiKey: string) => void;
};

const ApiKeyInput = ({ setApiKey }: Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  const handleSubmit = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      setIsSubmitted(true);
      setTempApiKey(""); // Clear temp input for security
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
          <p className="api-key-status">
            ✅ API key submitted and ready to use
          </p>
          <button onClick={handleReenter} className="api-key-reenter-btn">
            Re-enter API Key
          </button>
        </div>
      )}

      <p className="api-key-help">
        Your API key is only sent to the server for processing and never stored.
      </p>
    </div>
  );
};

export default ApiKeyInput;
