import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface DateDisplayProps {
  dateAdded: Date;
  dateModified: Date;
}

export function DateDisplay({ dateAdded, dateModified }: DateDisplayProps) {
  const noEditsBeenMade = dateAdded.getTime() === dateModified.getTime();
  const addedDate = new Date(dateAdded).toLocaleDateString();

  if (noEditsBeenMade) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm">Added {addedDate}</span>
      </div>
    );
  }

  const relativeTime = dayjs(dateModified).fromNow();

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Calendar className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <span className="text-sm">
        Added {addedDate} (modified {relativeTime})
      </span>
    </div>
  );
}
