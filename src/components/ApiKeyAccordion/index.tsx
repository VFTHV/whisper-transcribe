import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import ApiKeyInput from "./ApiKeyInput";

type Props = {
  setApiKey: (apiKey: string) => void;
};

const ApiKeyAccordion = ({ setApiKey }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      {/* Accordion Toggle Button */}
      <div className="header-main">
        <button
          className="accordion-toggle"
          onClick={toggleAccordion}
          aria-expanded={isExpanded}
          aria-controls="api-key-accordion-content"
        >
          <span>{isExpanded ? "Hide" : "Show"} API Key Settings</span>
          {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div
        id="api-key-accordion-content"
        className={`accordion-content ${isExpanded ? "expanded" : "collapsed"}`}
      >
        <ApiKeyInput setApiKey={setApiKey} setIsExpanded={setIsExpanded} />
      </div>
    </div>
  );
};

export default ApiKeyAccordion;
