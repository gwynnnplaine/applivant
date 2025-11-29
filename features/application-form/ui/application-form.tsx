"use client";

import { Form } from "@/components/ui/form";
import { FormCurrencyInput } from "@/components/ui/form/form-currency-input";
import { FormInput } from "@/components/ui/form/form-input";
import { FormSelect } from "@/components/ui/form/form-select";
import {
  APPLICATION_STATUS,
  JOB_TYPE,
  JobApplicationInput,
  JobApplicationInputSchema,
} from "@/entities/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormActions } from "./form-actions";
import { FormTextarea } from "./form-textarea";

interface ApplicationFormProps {
  defaultValues?: Partial<JobApplicationInput>;
  onSubmit: (data: JobApplicationInput) => void;
  onDelete?: () => void;
}

const DEFAULT_VALUES: Partial<JobApplicationInput> = {
  status: APPLICATION_STATUS.APPLIED,
  jobType: JOB_TYPE.FULL_TIME,
  salary: "",
  company: "",
  jobTitle: "",
  location: "",
  jobUrl: "",
  notes: "",
};

export function ApplicationForm({
  defaultValues,
  onSubmit,
  onDelete,
}: ApplicationFormProps) {
  const form = useForm<JobApplicationInput>({
    resolver: zodResolver(JobApplicationInputSchema),
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          control={form.control}
          name="company"
          label="Company"
          placeholder="Acme Corp"
          required
        />
        <FormInput
          control={form.control}
          name="jobTitle"
          label="Job Title"
          placeholder="Frontend Engineer"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            control={form.control}
            name="status"
            label="Status"
            placeholder="Select Status"
            options={Object.values(APPLICATION_STATUS)}
            required
          />
          <FormSelect
            control={form.control}
            name="jobType"
            label="Job Type"
            placeholder="Select Type"
            options={Object.values(JOB_TYPE)}
            required
          />
        </div>

        <FormCurrencyInput
          control={form.control}
          name="salary"
          label="Salary (Annual)"
          placeholder="120,000"
        />
        <FormInput
          control={form.control}
          name="location"
          label="Location"
          placeholder="San Francisco, CA"
        />
        <FormInput
          control={form.control}
          name="jobUrl"
          label="Job URL"
          placeholder="https://..."
        />

        <FormTextarea
          control={form.control}
          name="notes"
          label="Notes"
          placeholder="Interview notes..."
        />

        <FormActions onDelete={onDelete} />
      </form>
    </Form>
  );
}
