import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, RefreshCw, Smartphone, Shield, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export default function Settings() {
  const s = useStore();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(s.settings?.currency || 'ريال يمني');
  const [pin, setPin] = useState('');
  const [isLocked, setIsLocked] = useState(!!localStorage.getItem('app-passcode'));
  const [loading, setLoading] = useState(false);

  const handleCurrencySave = () => {
    s.updateSettings({ currency });
    alert('تم تحديث العملة.');
  };

  const handleLockToggle = () => {
    if (isLocked) {
      if (confirm('هل تريد إلغاء قفل التطبيق؟')) {
        localStorage.removeItem('app-passcode');
        setIsLocked(false);
        alert('تم إلغاء القفل.');
      }
    } else {
      if (pin.length < 4) {
        alert('يرجى إدخال رمز مرور مكون من 4 أرقام على الأقل.');
        return;
      }
      localStorage.setItem('app-passcode', pin);
      setIsLocked(true);
      setPin('');
      alert('تم تفعيل القفل.');
    }
  };

  const handleLogout = async () => {
    if (confirm('هل تريد الخروج من النظام؟')) {
      if (Capacitor.isNativePlatform()) {
        await App.exitApp();
      } else {
        window.close();
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">الإعدادات</h1>

      <Card accent className="mb-4">
        <h3 className="text-card-title font-bold mb-3 flex items-center gap-2">
          <Info size={18} className="text-info" /> معلومات التطبيق
        </h3>
        <p className="text-small text-text-secondary">الإصدار: 1.0.0</p>
        <p className="text-small text-text-secondary">المطور: Albakalat Team</p>
        <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="text-small text-primary underline mt-1 block">
          تواصل مع المطور عبر واتساب
        </a>
      </Card>

      <Card accent className="mb-4">
        <h3 className="text-card-title font-bold mb-3 flex items-center gap-2">
          <RefreshCw size={18} className="text-warning" /> العملة
        </h3>
        <div className="flex gap-2">
          <Input
            label="العملة"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="ريال يمني"
            className="flex-1"
          />
          <Button onClick={handleCurrencySave} className="self-end">حفظ</Button>
        </div>
      </Card>

      <Card accent className="mb-4">
        <h3 className="text-card-title font-bold mb-3 flex items-center gap-2">
          <Shield size={18} className="text-danger" /> الأمان
        </h3>
        <div className="flex gap-2 items-end">
          <Input
            label={isLocked ? 'القفل مفعل' : 'رمز المرور الجديد'}
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            disabled={isLocked}
            className="flex-1"
          />
          <Button onClick={handleLockToggle} variant={isLocked ? 'danger' : 'primary'} className="self-end">
            {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
            {isLocked ? 'إلغاء القفل' : 'تفعيل القفل'}
          </Button>
        </div>
      </Card>

      <Card accent className="mb-4">
        <h3 className="text-card-title font-bold mb-3 flex items-center gap-2">
          <Smartphone size={18} className="text-primary" /> الخروج
        </h3>
        <Button variant="danger" fullWidth onClick={handleLogout}>
          الخروج من النظام
        </Button>
      </Card>
    </div>
  );
}
