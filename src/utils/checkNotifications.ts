import { getNotifications, addNotification } from './notifications';
import { useStore } from '@/store';

export function checkAllNotifications() {
  const s = useStore();
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // 1. إشعارات المخزون المنخفض
  s.products.forEach((p: any) => {
    if ((p.stockQuantity || 0) <= (p.minStock || 20)) {
      addNotification({
        type: 'warning',
        title: 'مخزون منخفض',
        message: `المنتج "${p.name}" وصل إلى الحد الأدنى (${p.stockQuantity || 0} حبة).`,
        read: false,
      });
    }
  });

  // 2. إشعارات ديون العملاء
  s.customers.forEach((c: any) => {
    if (c.balance > 0) {
      addNotification({
        type: 'danger',
        title: 'رصيد مستحق',
        message: `العميل "${c.name}" عليه مبلغ ${c.balance} ${s.settings?.currency || 'ريال يمني'}.`,
        read: false,
      });
    }
  });

  // 3. إشعارات ديون الموردين
  s.suppliers.forEach((sup: any) => {
    if (sup.balance > 0) {
      addNotification({
        type: 'info',
        title: 'رصيد مورد',
        message: `المورد "${sup.name}" له مبلغ ${sup.balance} ${s.settings?.currency || 'ريال يمني'}.`,
        read: false,
      });
    }
  });

  // 4. إشعارات المبيعات الآجلة (اختياري)
  // يمكن إضافة المزيد هنا حسب الحاجة
}
