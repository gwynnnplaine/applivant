import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onDelete?: () => void;
  submitLabel?: string;
  deleteLabel?: string;
}

export function FormActions({
  onDelete,
  submitLabel = "Submit Application",
  deleteLabel = "Delete Application",
}: FormActionsProps) {
  return (
    <div className="flex justify-between pt-4">
      {onDelete ? (
        <Button type="button" variant="destructive" onClick={onDelete}>
          {deleteLabel}
        </Button>
      ) : (
        <div />
      )}
      <Button className="ml-auto" type="submit">
        {submitLabel}
      </Button>
    </div>
  );
}
