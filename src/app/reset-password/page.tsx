// src/app/reset-password/page.tsx
"use client";

import { Suspense } from "react";
import ResetPasswordForm from "../../frontend/components/forms/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
