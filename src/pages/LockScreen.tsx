import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    const storedPin = localStorage.getItem('app-passcode');
    if (!storedPin) {
      onUnlock();
      return;
    }
    if (pin === storedPin) {
      setError('');
      onUnlock();
    } else {
      setError('رمز المرور غير صحيح');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface rounded-card shadow-card p-6 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
            <Lock size={40} className="text-primary" />
          </div>
        </div>
        <h1 className="text-app-title font-bold text-center text-text-primary mb-2">تطبيق البقالات</h1>
        <p className="text-small text-center text-text-secondary mb-6">أدخل رمز المرور لفتح التطبيق</p>
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="****"
          inputMode="numeric"
          className="text-center text-2xl tracking-widest"
          error={error}
        />
        <Button fullWidth onClick={handleUnlock} className="mt-4">فتح</Button>
      </div>
    </div>
  );
}
