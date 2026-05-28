import { Suspense } from "react";
import LoginContent from "./_Content";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
