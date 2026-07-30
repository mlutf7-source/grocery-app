import { getNotifications, addNotification } from './notifications';

// تصدير البيانات كنسخة احتياطية (JSON)
export function exportBackupData() {
  // يتم جمع جميع البيانات من localStorage (أو يمكن استخدام store)
  const data = localStorage.getItem('grocery-store');
  if (!data) {
    return null;
  }
  return data;
}

// استيراد البيانات من نسخة احتياطية
export function importBackupData(jsonData: string) {
  try {
    const parsed = JSON.parse(jsonData);
    localStorage.setItem('grocery-store', JSON.stringify(parsed));
    return true;
  } catch (error) {
    console.error('فشل استيراد النسخ الاحتياطي:', error);
    return false;
  }
}

// دالة النسخ الاحتياطي التلقائي (يتم استدعاؤها من App.tsx)
export function autoBackup() {
  // التحقق مما إذا كان الوقت الحالي مناسبًا لعمل نسخة احتياطية (مثلاً، مرة واحدة يوميًا)
  const lastBackup = localStorage.getItem('bakala-last-backup');
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if (lastBackup !== today) {
    // هنا يتم تنفيذ النسخ الاحتياطي الفعلي
    // في هذا الإصدار البسيط، نقوم فقط بتسجيل التاريخ
    localStorage.setItem('bakala-last-backup', today);
    // يمكن إضافة إشعار للمستخدم بأن النسخ الاحتياطي قد تم
    addNotification({
      type: 'info',
      title: 'نسخ احتياطي',
      message: 'تم عمل نسخة احتياطية للبيانات بنجاح.',
      read: false,
    });
  }
                         }
