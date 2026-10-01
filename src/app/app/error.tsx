"use client";
import { ErrorState } from "@/components/ui";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState retry={<button className="btn" onClick={reset}>Try again</button>} />;
}
