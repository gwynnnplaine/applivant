"use client";

import {
  JobApplicationInput,
  JobApplicationInputSchema,
} from "@/app/types/job-application-input.types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form/form-input";
import { FormSelect } from "@/components/ui/form/form-select";
import { Textarea } from "@/components/ui/textarea";
import { APPLICATION_STATUS } from "@/entities/application-status";
import { JOB_TYPE } from "@/entities/job-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ApplicationFormProps {
  onSubmit: (data: JobApplicationInput) => void;
  defaultValues?: Partial<JobApplicationInput>;
}

export function ApplicationForm({
  onSubmit,
  defaultValues,
}: ApplicationFormProps) {
  const form = useForm<JobApplicationInput>({
    resolver: zodResolver(JobApplicationInputSchema),
    defaultValues,
  });

  return (
    <div>
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
          />
          <FormInput
            control={form.control}
            name="jobTitle"
            label="Job Title"
            placeholder="Frontend Engineer"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select Status"
              options={Object.values(APPLICATION_STATUS)}
            />
            <FormSelect
              control={form.control}
              name="jobType"
              label="Job Type"
              placeholder="Select Type"
              options={Object.values(JOB_TYPE)}
            />
          </div>
          <FormInput
            control={form.control}
            name="salary"
            label="Salary"
            placeholder="$120,000"
          />

          <FormInput
            control={form.control}
            name="jobUrl"
            label="Job URL"
            placeholder="https://..."
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Interview notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center pt-4">
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
