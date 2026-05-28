import { Suspense } from "react";
import TrackingContent from "./_Content";

export default function TrackingPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
