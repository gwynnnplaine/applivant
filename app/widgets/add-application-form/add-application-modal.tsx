import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { AddApplicationForm } from "./add-application-form";
import { JobApplicationInputSchema } from "@/entities/job-application";
import z from "zod";

interface AddApplicationModalProps {
  open: boolean;
  onSubmit: (data: z.infer<typeof JobApplicationInputSchema>) => void;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<z.infer<typeof JobApplicationInputSchema>>;
}

export function AddApplicationModal({
  open,
  onSubmit,
  defaultValues,
}: AddApplicationModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <AddApplicationForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
