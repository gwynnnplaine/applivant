const MAX_VISIBLE_ERRORS = 3;

export function ErrorList({ errors }: { errors: string[] }) {
  const visible = errors.slice(0, MAX_VISIBLE_ERRORS);
  const remaining = errors.length - MAX_VISIBLE_ERRORS;

  return (
    <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
      {visible.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
      {remaining > 0 && <li>...and {remaining} more errors</li>}
    </ul>
  );
}
