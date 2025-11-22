"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddApplicationForm } from "@/app/widgets/add-application-form/add-application-form";

export default function NewApplicationModal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <AddApplicationForm
          onSubmit={() => {
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
