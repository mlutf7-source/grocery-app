import { useState } from 'react';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function SupplierReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [supplierId, setSupplierId] = useState('');

  const supplier = s.suppliers.find((sup: any) => sup.id === supplierId);
  const purchases = s.purchases.filter((p: any) => p.supplierId === supplierId);
  const movements = s.cashMovements.filter((m: any) => m.referenceId === supplierId && m.referenceType === 'manual');

  const totalPurchases = purchases.reduce((sum: number, p: any) => sum + p.total, 0);
  const totalPaid = purchases.reduce((sum: number, p: any) => sum + p.paid, 0);
  const totalRemaining = purchases.reduce((sum: number, p: any) => sum + p.remaining, 0);
  const totalPayments = movements.filter((m: any) => m.type === 'withdraw').reduce((sum: number, m: any) => sum + m.amount, 0);
  const totalReceipts = movements.filter((m: any) => m.type === 'deposit').reduce((sum: number, m: any) => sum + m.amount, 0);

  const finalBalance = totalPurchases - totalPaid - totalPayments + totalReceipts;

  const reportId = `supplier-report-${supplierId || 'empty'}`;

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1">اختر المورد</label>
          <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="input-field">
            <option value="">اختر مورداً</option>
            {s.suppliers.map((sup: any) => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
          </select>
        </div>
        <Button onClick={() => sharePdfFromElement(reportId, `تقرير ${supplier?.name || 'مورد'}`)}>
          <Printer size={16} className="mr-1" /> طباعة
        </Button>
        <Button variant="secondary" onClick={() => sharePdfFromElement(reportId, `تقرير ${supplier?.name || 'مورد'}`)}>
          <Share2 size={16} className="mr-1" /> مشاركة
        </Button>
      </div>

      {supplier && (
        <>
          <Card accent className="!p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-card-title font-bold">{supplier.name}</h2>
                <p className="text-small text-text-secondary">{supplier.phone || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-small text-text-secondary">الرصيد النهائي</p>
                <p className={`text-financial ${finalBalance > 0 ? 'text-success' : finalBalance < 0 ? 'text-danger' : 'text-info'}`}>
                  {finalBalance > 0 ? `له ${fmt(finalBalance)}` : finalBalance < 0 ? `عليه ${fmt(Math.abs(finalBalance))}` : 'متزن'}
                  <span className="text-small">{currency}</span>
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card variant="accent" className="!p-3">
              <p className="text-small text-text-secondary">إجمالي المشتريات</p>
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
            <Card variant="accent" className="!p-3">
              <p className="text-small text-text-secondary">سندات الصرف</p>
              <p className="text-financial text-danger">{fmt(totalPayments)} <span className="text-small">{currency}</span></p>
            </Card>
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="text-card-title text-warning">فواتير الشراء</h3>
            {purchases.length === 0 ? <p className="text-small text-text-secondary">لا توجد فواتير شراء لهذا المورد.</p> : purchases.map((p: any) => (
              <Card key={p.id} className="!p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-body">فاتورة شراء #{p.invoiceNo}</p>
                    <p className="text-small text-text-secondary">{dt(p.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-financial text-warning">{fmt(p.total)} <span className="text-small">{currency}</span></p>
                    <p className="text-small text-text-secondary">مدفوع: {fmt(p.paid)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="text-card-title text-danger">سندات الصرف</h3>
            {movements.filter(m => m.type === 'withdraw').length === 0 ? <p className="text-small text-text-secondary">لا توجد سندات صرف.</p> : movements.filter(m => m.type === 'withdraw').map((m: any) => (
              <Card key={m.id} className="!p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-body">{m.description}</p>
                    <p className="text-small text-text-secondary">{dt(m.createdAt)}</p>
                  </div>
                  <span className="text-financial text-danger">{fmt(m.amount)} <span className="text-small">{currency}</span></span>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="text-card-title text-success">سندات القبض</h3>
            {movements.filter(m => m.type === 'deposit').length === 0 ? <p className="text-small text-text-secondary">لا توجد سندات قبض.</p> : movements.filter(m => m.type === 'deposit').map((m: any) => (
              <Card key={m.id} className="!p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-body">{m.description}</p>
                    <p className="text-small text-text-secondary">{dt(m.createdAt)}</p>
                  </div>
                  <span className="text-financial text-success">{fmt(m.amount)} <span className="text-small">{currency}</span></span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
