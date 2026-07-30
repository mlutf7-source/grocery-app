import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { CheckCircle2, Bell, AlertTriangle, Info, Check } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function Notifications() {
  const s = useStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  // قراءة الإشعارات من الستور أو من localStorage (حسب كيفية تخزينها)
  // في هذا النموذج سنقوم بمحاكاة قراءتها من الستور، لأننا لم نضفها كجزء من الستور الأساسي.
  // يمكنك استبدال هذا الجزء بمنطقك الحقيقي.

  useEffect(() => {
    // مثال: توليد إشعارات من البيانات الحالية
    const newNotifications: any[] = [];

    // 1. إشعارات المخزون المنخفض
    s.products.forEach((p: any) => {
      if ((p.stockQuantity || 0) <= (p.minStock || 20)) {
        newNotifications.push({
          id: `low-stock-${p.id}`,
          type: 'warning',
          title: 'مخزون منخفض',
          message: `المنتج "${p.name}" وصل إلى الحد الأدنى (${fmt(p.stockQuantity || 0)} حبة).`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    });

    // 2. إشعارات ديون العملاء
    s.customers.forEach((c: any) => {
      if (c.balance > 0) {
        newNotifications.push({
          id: `customer-debt-${c.id}`,
          type: 'danger',
          title: 'رصيد مستحق',
          message: `العميل "${c.name}" عليه مبلغ ${fmt(c.balance)} ${s.settings?.currency || 'ريال يمني'}.`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    });

    // 3. إشعارات مبيعات آجلة (اختياري)
    // ... يمكنك إضافة المزيد هنا

    setNotifications(newNotifications);
  }, [s.products, s.customers, s.settings?.currency]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-warning" size={20} />;
      case 'danger': return <AlertTriangle className="text-danger" size={20} />;
      case 'info': return <Info className="text-info" size={20} />;
      default: return <Bell className="text-primary" size={20} />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-warning/10 border-l-warning';
      case 'danger': return 'bg-danger/10 border-l-danger';
      case 'info': return 'bg-info/10 border-l-info';
      default: return 'bg-primary-light border-l-primary';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title mb-0">الإشعارات</h1>
        {unreadCount > 0 && (
          <Button variant="secondary" size="small" onClick={markAllAsRead} className="flex items-center gap-1">
            <Check size={16} /> تعليم الكل مقروء
          </Button>
        )}
      </div>

      {notifications.length === 0 ? <EmptyState message="لا توجد إشعارات حالية" /> : (
        <div className="space-y-3">
          {notifications.map((n: any) => (
            <Card key={n.id} className={`!p-4 border-l-4 ${getBgClass(n.type)} ${n.read ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-body">{n.title}</h3>
                    <span className="text-small text-text-secondary">{dt(n.createdAt)}</span>
                  </div>
                  <p className="text-small text-text-secondary mt-1">{n.message}</p>
                  {!n.read && (
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item))} className="text-xs text-primary underline">
                        تعليم كمقروء
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
                                       }
