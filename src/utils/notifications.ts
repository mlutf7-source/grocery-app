// تخزين الإشعارات في localStorage
const STORAGE_KEY = 'bakala-notifications';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// دالة مساعدة لتوليد معرف فريد
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// جلب جميع الإشعارات
export function getNotifications(): Notification[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// إضافة إشعار جديد (يمنع التكرار)
export function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
  const notifications = getNotifications();
  
  // التحقق من عدم وجود إشعار مكرر (نفس العنوان والرسالة)
  const exists = notifications.some(
    (n) => n.title === notification.title && n.message === notification.message && !n.read
  );
  
  if (exists) return;

  const newNotification: Notification = {
    id: generateId(),
    ...notification,
    createdAt: new Date().toISOString(),
  };

  // إضافة الإشعار الجديد وتحديث التخزين (الحد الأقصى 50 إشعار)
  const updated = [newNotification, ...notifications].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// تعليم جميع الإشعارات كمقروءة
export function markAllAsRead() {
  const notifications = getNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// الحصول على عدد الإشعارات غير المقروءة
export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter((n) => !n.read).length;
}
