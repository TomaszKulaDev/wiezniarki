import React from "react";

interface FormFieldProps {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  children: React.ReactNode;
}

export default function FormField({
  id,
  name,
  label,
  required = false,
  error,
  helpText,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}
