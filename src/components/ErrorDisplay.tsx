import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

const ErrorDisplay = ({ error, setError }: Props) => {
  if (!error) return null;

  return (
    <div className="error" style={{ position: "relative" }}>
      <p>❌ {error}</p>

      <button
        onClick={() => setError("")}
        className="error-close-button"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#dc3545",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0",
          width: "20px",
          height: "20px",
        }}
        title="Close error"
      >
        <IoMdCloseCircle />
      </button>
    </div>
  );
};

export default ErrorDisplay;
