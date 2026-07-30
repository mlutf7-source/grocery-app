// محاكاة معرف الجهاز (على الويب يتم تخزينه في localStorage)
const getDeviceId = (): string => {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem('device_id', id);
  }
  return id;
};

// تخزين رمز التفعيل
const ACTIVATION_KEY = 'bakala_activation_code';
const ACTIVATION_DATA_KEY = 'bakala_activation_data';

// توليد رمز تفعيل عشوائي (للمسؤول)
export const generateActivationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// التحقق مما إذا كان التطبيق مفعلاً
export const isActivated = (): boolean => {
  const code = localStorage.getItem(ACTIVATION_KEY);
  const data = localStorage.getItem(ACTIVATION_DATA_KEY);
  
  if (!code || !data) return false;
  
  try {
    const parsed = JSON.parse(data);
    // التحقق من أن رمز التفعيل مرتبط بهذا الجهاز
    if (parsed.deviceId !== getDeviceId()) return false;
    return true;
  } catch {
    return false;
  }
};

// التحقق مما إذا كانت الفترة التجريبية قد انتهت
export const isTrialExpired = (): boolean => {
  const trialStart = localStorage.getItem('trial_start');
  if (!trialStart) {
    // بدء الفترة التجريبية لأول مرة
    localStorage.setItem('trial_start', new Date().toISOString());
    return false;
  }
  
  const startDate = new Date(trialStart);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 30;
};

// الحصول على الأيام المتبقية في الفترة التجريبية
export const getRemainingDays = (): number => {
  const trialStart = localStorage.getItem('trial_start');
  if (!trialStart) {
    localStorage.setItem('trial_start', new Date().toISOString());
    return 30;
  }
  
  const startDate = new Date(trialStart);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - diffDays);
};

// تفعيل التطبيق برمز
export const activateApp = (code: string): boolean => {
  const trimmedCode = code.trim().toUpperCase();
  
  // في هذا الإصدار البسيط، نقبل أي رمز صحيح التنسيق
  // يمكنك إضافة منطق للتحقق من الرمز من الخادم هنا
  const isValid = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(trimmedCode);
  
  if (!isValid) return false;
  
  localStorage.setItem(ACTIVATION_KEY, trimmedCode);
  localStorage.setItem(ACTIVATION_DATA_KEY, JSON.stringify({
    code: trimmedCode,
    deviceId: getDeviceId(),
    activatedAt: new Date().toISOString()
  }));
  
  return true;
};
