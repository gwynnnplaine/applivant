"use client";

import { useParams } from "next/navigation";
import { ViewApplicationContainer } from "@/app/shared/containers/view-application-container";

export default function ViewApplicationPage() {
  const { id } = useParams<{ id: string }>();

  return <ViewApplicationContainer applicationId={id} />;
}
