import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random()}`;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          id={checkboxId}
          type="checkbox"
          className="opacity-0 w-4 h-4 cursor-pointer absolute"
          {...props}
        />
        <div className="w-4 h-4 border-2 border-primary rounded transition-colors duration-200 peer-checked:bg-primary flex items-center justify-center pointer-events-none bg-background" />
      </div>
      {label && (
        <label htmlFor={checkboxId} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}
