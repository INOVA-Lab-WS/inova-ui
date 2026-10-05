import * as React from "react";
import { cn } from "../lib/cn";

/** SuggestionList · Figma "suggestion-list". A vertical stack of ActionCards. */
export function SuggestionList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="list" className={cn("flex w-full flex-col gap-2 [&>*]:w-full", className)} {...props} />;
}
