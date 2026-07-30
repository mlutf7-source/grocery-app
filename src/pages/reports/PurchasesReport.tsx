import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function PurchasesReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';

  const purchases = [...s.purchases].reverse();

  const totalPurchases = purchases.reduce((sum: number, p: any) => sum + p.total, 0);
  const totalPaid = purchases.reduce((sum: number, p: any) => sum + p.paid, 0);
  const totalRemaining = purchases.reduce((sum: number, p: any) => sum + p.remaining, 0);

  const reportId = 'purchases-report';

  const supName = (id: string) => s.suppliers.find((sup: any) => sup.id === id)?.name || 'نقدي';

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex justify-end gap-2">
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المشتريات')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Printer size={14} /> طباعة
        </button>
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المشتريات')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Share2 size={14} /> مشاركة
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">الإجمالي</p>
          <p className="text-financial text-warning">{fmt(totalPurchases)} <span className="text-small">{currency}</span></p>
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
        {purchases.length === 0 ? <p className="text-small text-text-secondary text-center">لا توجد فواتير شراء.</p> : purchases.map((p: any) => (
          <Card key={p.id} className="!p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-body">فاتورة شراء #{p.invoiceNo}</p>
                <p className="text-small text-text-secondary">{supName(p.supplierId)}</p>
                <p className="text-small text-text-secondary">{dt(p.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-financial text-warning">{fmt(p.total)} <span className="text-small">{currency}</span></p>
                <p className="text-small text-text-secondary">مدفوع: {fmt(p.paid)}</p>
                {p.remaining > 0 && <p className="text-small text-danger">متبقي: {fmt(p.remaining)}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
            }
