interface NotesDisplayProps {
  notes?: string;
}

export function NotesDisplay({ notes }: NotesDisplayProps) {
  if (!notes) return null;

  return (
    <div className="rounded-lg bg-muted p-4">
      <h4 className="mb-2 text-sm font-semibold text-foreground">Notes</h4>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {notes}
      </p>
    </div>
  );
}
