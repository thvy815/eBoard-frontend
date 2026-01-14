"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
