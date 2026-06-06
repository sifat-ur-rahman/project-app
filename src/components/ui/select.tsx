import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 cursor-pointer appearance-none ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

// Export additional components for backwards compatibility
export const SelectTrigger = Select;
export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const SelectItem = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => <option value={value}>{children}</option>;
export const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <option value="">{placeholder || "Select..."}</option>
);
export const SelectGroup = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const SelectLabel = ({ children }: { children: React.ReactNode }) => (
  <optgroup label={String(children)}></optgroup>
);
export const SelectSeparator = () => null;
export const SelectScrollUpButton = () => null;
export const SelectScrollDownButton = () => null;
