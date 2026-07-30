import Card from '@/components/ui/Card';
import { ShoppingCart, ArrowDownToLine, Package, BarChart3, Users, Wallet, Receipt, Trash2 } from 'lucide-react';

export default function Guide() {
  const steps = [
    { title: 'إضافة منتج', desc: 'من صفحة المنتجات، أضف منتجاً جديداً بتحديد الوحدة (كرتون/حبة) والسعر.', icon: Package },
    { title: 'بيع منتج', desc: 'من صفحة البيع، ابحث عن المنتج، حدد الكمية، واختر نوع البيع (نقدي/آجل).', icon: ShoppingCart },
    { title: 'شراء منتج', desc: 'من صفحة المشتريات، أضف المنتجات، اختر المورد، وحدد طريقة الدفع.', icon: ArrowDownToLine },
    { title: 'مراقبة المخزون', desc: 'من صفحة المخزون، تابع كميات المنتجات والقيمة المالية للمخزون.', icon: Package },
    { title: 'إدارة العملاء', desc: 'من صفحة العملاء، أضف العملاء وتابع أرصدتهم (عليه/له).', icon: Users },
    { title: 'إدارة الصناديق', desc: 'من صفحة الصناديق، تابع رصيد كل صندوق وحركاته المالية.', icon: Wallet },
    { title: 'السندات', desc: 'من صفحات سند قبض/صرف، قم بتسجيل الحركات اليدوية للعملاء والموردين.', icon: Receipt },
    { title: 'سلة المحذوفات', desc: 'من صفحة المحذوفات، يمكنك استعادة أي عنصر تم حذفه.', icon: Trash2 },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">طريقة الاستخدام</h1>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={index} accent className="!p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-body">{step.title}</h3>
                <p className="text-small text-text-secondary mt-1">{step.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
