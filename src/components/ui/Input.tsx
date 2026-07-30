import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number' | 'tel' | 'date';
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel';
  className?: string;
  error?: string;
  autoComplete?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      onChange,
      type = 'text',
      placeholder,
      inputMode,
      className,
      error,
      autoComplete = 'off',
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold mb-1 text-text-primary">{label}</label>}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={clsx(
            'input-field',
            error && 'border-danger focus:border-danger',
            className
          )}
        />
        {error && <p className="text-small text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
