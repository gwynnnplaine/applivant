import { Spinner } from "@/components/ui/spinner";

export function TableLoadingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Loading applications...</h1>
      <Spinner className="size-20" />
    </div>
  );
}
