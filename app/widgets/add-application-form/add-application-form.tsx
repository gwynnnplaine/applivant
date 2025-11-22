"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { JobApplicationInputSchema } from "@/entities/job-application";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { APPLICATION_STATUS } from "@/entities/application-status";
import { JOB_TYPE } from "@/entities/job-type";

import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";

interface AddApplicationFormProps {
  onSubmit: (data: z.infer<typeof JobApplicationInputSchema>) => void;
  defaultValues?: Partial<z.infer<typeof JobApplicationInputSchema>>;
}

export function AddApplicationForm({
  onSubmit,
  defaultValues,
}: AddApplicationFormProps) {
  const form = useForm<z.infer<typeof JobApplicationInputSchema>>({
    resolver: zodResolver(JobApplicationInputSchema),
    defaultValues,
  });

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>

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
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Interview notes..."
                    {...field}
                  />
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
