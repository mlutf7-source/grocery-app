import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className,
}: ButtonProps) {
  const baseClasses = 'rounded-btn px-6 py-3 font-semibold transition-colors text-body';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    danger: 'bg-danger text-white hover:bg-red-700',
    secondary: 'bg-gray-200 text-text-primary hover:bg-gray-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
