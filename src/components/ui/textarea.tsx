import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-vertical ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
