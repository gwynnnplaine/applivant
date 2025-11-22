import React from "react";

interface ShowProps {
  when: boolean;
}

export function Show({ when, children }: React.PropsWithChildren<ShowProps>) {
  if (!when) {
    return null;
  }

  return <>{children}</>;
}
