import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function ExpensesReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';

  const expenses = [...s.expenses].reverse();

  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

  const reportId = 'expenses-report';

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex justify-end gap-2">
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المصروفات')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Printer size={14} /> طباعة
        </button>
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المصروفات')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Share2 size={14} /> مشاركة
        </button>
      </div>

      <Card accent className="!p-4">
        <div className="flex justify-between items-center">
          <span className="text-small text-text-secondary">إجمالي المصروفات</span>
          <span className="text-financial text-danger">{fmt(totalExpenses)} <span className="text-small">{currency}</span></span>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-card-title">قائمة المصروفات</h3>
        {expenses.length === 0 ? <p className="text-small text-text-secondary text-center">لا توجد مصروفات.</p> : expenses.map((e: any) => (
          <Card key={e.id} className="!p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-body">{e.title}</p>
                <p className="text-small text-text-secondary">{e.notes || '-'}</p>
                <p className="text-small text-text-secondary">{dt(e.createdAt)}</p>
              </div>
              <span className="text-financial text-danger">{fmt(e.amount)} <span className="text-small">{currency}</span></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
      }
