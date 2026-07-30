import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isTrialExpired, getRemainingDays, activateApp } from '@/utils/activation';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface ActivationPageProps {
  onActivated: () => void;
}

export default function ActivationPage({ onActivated }: ActivationPageProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!code.trim()) {
      setError('يرجى إدخال رمز التفعيل');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const success = await activateApp(code.trim());
      if (success) {
        onActivated();
      } else {
        setError('رمز التفعيل غير صحيح أو منتهي الصلاحية');
      }
    } catch (err) {
      setError('حدث خطأ أثناء التفعيل');
    } finally {
      setLoading(false);
    }
  };

  const daysLeft = getRemainingDays();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface rounded-card shadow-card p-6 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center">
            <ShieldCheck size={40} className="text-warning" />
          </div>
        </div>
        <h1 className="text-app-title font-bold text-center text-text-primary mb-2">تفعيل التطبيق</h1>
        {daysLeft > 0 ? (
          <p className="text-small text-center text-text-secondary mb-4">
            الفترة التجريبية متبقية: <span className="font-bold text-primary">{daysLeft}</span> يوم
          </p>
        ) : (
          <p className="text-small text-center text-danger mb-4">
            انتهت الفترة التجريبية. يرجى تفعيل التطبيق للاستمرار.
          </p>
        )}
        <Input
          label="رمز التفعيل"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          error={error}
        />
        <Button fullWidth onClick={handleActivate} loading={loading} className="mt-4">
          تفعيل
        </Button>
        <div className="mt-4 text-center">
          <a
            href="https://wa.me/YOUR_WHATSAPP_NUMBER?text=طلب%20تفعيل%20تطبيق%20البقالات"
            target="_blank"
            rel="noopener noreferrer"
            className="text-small text-primary hover:underline"
          >
            للتواصل مع المسؤول عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
