import { useState } from 'react';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function CashBoxReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [cashBoxId, setCashBoxId] = useState('default-cash-box');

  const cashBox = s.cashBoxes.find((b: any) => b.id === cashBoxId);
  const movements = s.cashMovements.filter((m: any) => m.cashBoxId === cashBoxId).reverse();

  const totalDeposits = movements.filter((m: any) => m.type === 'deposit').reduce((sum: number, m: any) => sum + m.amount, 0);
  const totalWithdrawals = movements.filter((m: any) => m.type === 'withdraw').reduce((sum: number, m: any) => sum + m.amount, 0);

  const reportId = `cashbox-report-${cashBoxId}`;

  const getDescription = (m: any) => {
    switch (m.referenceType) {
      case 'sale': return `فاتورة بيع #${m.referenceId?.slice(-4) || ''}`;
      case 'purchase': return `فاتورة شراء #${m.referenceId?.slice(-4) || ''}`;
      case 'expense': return `مصروف`;
      case 'manual': return m.description || 'سند يدوي';
      default: return m.description || 'حركة نقدية';
    }
  };

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1">اختر الصندوق</label>
          <select value={cashBoxId} onChange={e => setCashBoxId(e.target.value)} className="input-field">
            {s.cashBoxes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <Button onClick={() => sharePdfFromElement(reportId, `تقرير ${cashBox?.name || 'صندوق'}`)}>
          <Printer size={16} className="mr-1" /> طباعة
        </Button>
        <Button variant="secondary" onClick={() => sharePdfFromElement(reportId, `تقرير ${cashBox?.name || 'صندوق'}`)}>
          <Share2 size={16} className="mr-1" /> مشاركة
        </Button>
      </div>

      {cashBox && (
        <>
          <Card accent className="!p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-card-title font-bold">{cashBox.name}</h2>
                <p className="text-small text-text-secondary">آخر تحديث: {dt(cashBox.updatedAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-small text-text-secondary">الرصيد الحالي</p>
                <p className="text-financial text-primary">{fmt(cashBox.balance)} <span className="text-small">{currency}</span></p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card variant="accent" className="!p-3">
              <p className="text-small text-text-secondary">إجمالي الإيداعات</p>
              <p className="text-financial text-success">{fmt(totalDeposits)} <span className="text-small">{currency}</span></p>
            </Card>
            <Card variant="accent" className="!p-3">
              <p className="text-small text-text-secondary">إجمالي السحوبات</p>
              <p className="text-financial text-danger">{fmt(totalWithdrawals)} <span className="text-small">{currency}</span></p>
            </Card>
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="text-card-title">جميع الحركات</h3>
            {movements.length === 0 ? <p className="text-small text-text-secondary">لا توجد حركات لهذا الصندوق.</p> : movements.map((m: any) => (
              <Card key={m.id} className="!p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-body">{getDescription(m)}</p>
                    <p className="text-small text-text-secondary">{dt(m.createdAt)}</p>
                  </div>
                  <span className={`text-financial ${m.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                    {m.type === 'deposit' ? '+' : '-'}{fmt(m.amount)} <span className="text-small">{currency}</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
                                                                                       }
