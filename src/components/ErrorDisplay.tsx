type Props = {
  error: string;
};

const ErrorDisplay = ({ error }: Props) => {
  if (!error) return null;

  return (
    <div className="error">
      <p>❌ {error}</p>
    </div>
  );
};

export default ErrorDisplay;
