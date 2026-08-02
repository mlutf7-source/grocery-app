import { forwardRef, useState, useEffect } from 'react';
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

// دالة مساعدة لتنسيق الأرقام بالفواصل (1,000)
const formatNumberWithCommas = (value: string): string => {
  // إزالة أي فواصل موجودة أولاً
  const raw = value.replace(/,/g, '');
  // إذا كان فارغاً أو ليس رقماً، نعيد القيمة الأصلية
  if (!raw || isNaN(Number(raw))) return value;
  // تنسيق الرقم بالفواصل (باستخدام toLocaleString)
  return Number(raw).toLocaleString('en-US');
};

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
    // حالة لتخزين القيمة المنسقة (للأرقام فقط)
    const [displayValue, setDisplayValue] = useState(value);

    // تحديث العرض عند تغير القيمة الخارجية
    useEffect(() => {
      if (type === 'number' || inputMode === 'decimal' || inputMode === 'numeric') {
        setDisplayValue(formatNumberWithCommas(value));
      } else {
        setDisplayValue(value);
      }
    }, [value, type, inputMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, '');
      
      // إذا كان حقل أرقام، نمرر القيمة الخام (بدون فواصل) للـ onChange الخارجي
      if (type === 'number' || inputMode === 'decimal' || inputMode === 'numeric') {
        // إنشاء حدث جديد بالقيمة الخام
        const modifiedEvent = {
          ...e,
          target: { ...e.target, value: rawValue }
        };
        onChange(modifiedEvent as React.ChangeEvent<HTMLInputElement>);
        
        // تحديث العرض المنسق
        setDisplayValue(formatNumberWithCommas(rawValue));
      } else {
        // إذا لم يكن رقماً، نمرر القيمة كما هي
        onChange(e);
        setDisplayValue(e.target.value);
      }
    };

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold mb-1 text-text-primary">{label}</label>}
        <input
          ref={ref}
          type={type === 'number' ? 'text' : type} // تحويل type="number" إلى text للسماح بالفواصل
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={clsx(
            'input-field',
            'field-sizing-content', // توسيع الحقل تلقائياً
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
