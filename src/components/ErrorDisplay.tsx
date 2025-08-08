type Props = {
  error: string;
};

export function ErrorDisplay({ error }: Props) {
  if (!error) return null;

  return (
    <div className="error">
      <p>❌ {error}</p>
    </div>
  );
}
