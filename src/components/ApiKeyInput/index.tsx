import "./ApiKeyInput.css";

type Props = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
};

const ApiKeyInput = ({ apiKey, setApiKey }: Props) => {
  return (
    <div className="api-key-section">
      <h3>🔑 OpenAI API Key</h3>
      <input
        type="password"
        placeholder="Enter your OpenAI API key (sk-...)"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="api-key-input"
      />
      <p className="api-key-help">
        Your API key is only sent to the server for processing and never stored.
      </p>
    </div>
  );
};

export default ApiKeyInput;
