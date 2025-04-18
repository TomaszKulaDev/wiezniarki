import React from "react";

interface CheckboxInputProps {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
}

export default function CheckboxInput({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
  helpText,
  error,
  className = "",
}: CheckboxInputProps) {
  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            required={required}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {helpText && !error && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
