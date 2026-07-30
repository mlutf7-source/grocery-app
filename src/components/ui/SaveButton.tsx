import Button from './Button';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface SaveButtonProps {
  onClick: () => void;
  isEditing: boolean;
  hasChanged: boolean;
  labelNew?: string;
  labelUpdate?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function SaveButton({
  onClick,
  isEditing,
  hasChanged,
  labelNew = 'حفظ',
  labelUpdate = 'تحديث',
  icon,
  fullWidth = true,
  className,
}: SaveButtonProps) {
  const isDisabled = isEditing && !hasChanged;

  return (
    <Button
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        isDisabled
          ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
          : 'bg-primary text-white',
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {isEditing ? (hasChanged ? labelUpdate : 'لا توجد تغييرات') : labelNew}
    </Button>
  );
}
