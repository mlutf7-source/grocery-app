import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'icon';
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  className,
  onClick,
}: CardProps) {
  const variantClasses = {
    default: 'card',
    accent: 'card-accent',
    icon: 'bg-white rounded-icon shadow-icon flex flex-col items-center justify-center w-[56px] h-[56px] gap-1 transition-all hover:shadow-card-hover',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(variantClasses[variant], onClick && 'cursor-pointer', className)}
    >
      {children}
    </div>
  );
}
