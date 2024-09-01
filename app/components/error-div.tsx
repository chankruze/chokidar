import type { ReactNode } from "react";

type ErrorDivProps = {
  children: ReactNode;
};

export const ErrorDiv = ({ children }: ErrorDivProps) => {
  return <p className="text-sm font-medium text-red-500">{children}</p>;
};
