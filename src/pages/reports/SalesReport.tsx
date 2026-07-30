import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function SalesReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';

  const sales = [...s.sales].reverse();

  const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalPaid = sales.reduce((sum: number, sale: any) => sum + sale.paid, 0);
  const totalRemaining = sales.reduce((sum: number, sale: any) => sum + sale.remaining, 0);

  const reportId = 'sales-report';

  const custName = (id: string) => s.customers.find((c: any) => c.id === id)?.name || 'نقدي';

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex justify-end gap-2">
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المبيعات')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Printer size={14} /> طباعة
        </button>
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المبيعات')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Share2 size={14} /> مشاركة
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">الإجمالي</p>
          <p className="text-financial text-primary">{fmt(totalSales)} <span className="text-small">{currency}</span></p>
        </Card>
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">المدفوع</p>
          <p className="text-financial text-success">{fmt(totalPaid)} <span className="text-small">{currency}</span></p>
        </Card>
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">المتبقي</p>
          <p className="text-financial text-danger">{fmt(totalRemaining)} <span className="text-small">{currency}</span></p>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-card-title">قائمة الفواتير</h3>
        {sales.length === 0 ? <p className="text-small text-text-secondary text-center">لا توجد فواتير بيع.</p> : sales.map((sale: any) => (
          <Card key={sale.id} className="!p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-body">فاتورة #{sale.invoiceNo}</p>
                <p className="text-small text-text-secondary">{custName(sale.customerId)}</p>
                <p className="text-small text-text-secondary">{dt(sale.createdAt)}</p>
                {sale.type === 'credit' && <span className="text-small font-semibold px-2 py-0.5 rounded bg-warning/10 text-warning">آجل</span>}
              </div>
              <div className="text-right">
                <p className="text-financial text-primary">{fmt(sale.total)} <span className="text-small">{currency}</span></p>
                <p className="text-small text-text-secondary">مدفوع: {fmt(sale.paid)}</p>
                {sale.remaining > 0 && <p className="text-small text-danger">متبقي: {fmt(sale.remaining)}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
        }
