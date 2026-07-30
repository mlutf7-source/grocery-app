import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function ProfitReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';

  const totalSales = s.sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalPurchases = s.purchases.reduce((sum: number, p: any) => sum + p.total, 0);
  const totalExpenses = s.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

  const profit = totalSales - totalPurchases - totalExpenses;

  const reportId = 'profit-report';

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex justify-end gap-2">
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير الأرباح')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Printer size={14} /> طباعة
        </button>
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير الأرباح')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Share2 size={14} /> مشاركة
        </button>
      </div>

      <Card accent className="!p-4">
        <div className="text-center">
          <p className="text-small text-text-secondary">صافي الربح / الخسارة</p>
          <p className={`text-financial ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
            {profit >= 0 ? 'ربح' : 'خسارة'} {fmt(Math.abs(profit))} <span className="text-small">{currency}</span>
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">إجمالي المبيعات</p>
          <p className="text-financial text-primary">{fmt(totalSales)} <span className="text-small">{currency}</span></p>
        </Card>
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">إجمالي المشتريات</p>
          <p className="text-financial text-warning">{fmt(totalPurchases)} <span className="text-small">{currency}</span></p>
        </Card>
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">إجمالي المصروفات</p>
          <p className="text-financial text-danger">{fmt(totalExpenses)} <span className="text-small">{currency}</span></p>
        </Card>
      </div>
    </div>
  );
}
