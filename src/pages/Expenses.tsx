import { useState } from 'react';
import { useStore } from '@/store';
import { usePreventLeave } from '@/hooks/usePreventLeave';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function Expenses() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [f, setF] = useState({ title: '', amount: '', cashBoxId: 'default-cash-box', date: new Date().toISOString().split('T')[0], notes: '' });
  const [hasChanges, setHasChanges] = useState(false);

  usePreventLeave(hasChanges);

  const filtered = [...s.expenses].reverse();
  const totalExpenses = filtered.reduce((sum: number, e: any) => sum + (+e.amount || 0), 0);

  const reset = () => {
    setF({ title: '', amount: '', cashBoxId: 'default-cash-box', date: new Date().toISOString().split('T')[0], notes: '' });
    setEdit(null);
    setHasChanges(false);
  };

  const openAdd = () => { reset(); setOpen(true); };
  const openEdit = (e: any) => {
    setEdit(e);
    setF({
      title: e.title,
      amount: e.amount.toString(),
      cashBoxId: e.cashBoxId || 'default-cash-box',
      date: new Date(e.createdAt).toISOString().split('T')[0],
      notes: e.notes || ''
    });
    setHasChanges(true);
    setOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setF({ ...f, [field]: value });
    setHasChanges(true);
  };

  const save = () => {
    if (!f.title || !f.amount) return;
    const data = { title: f.title, amount: +f.amount, cashBoxId: f.cashBoxId, notes: f.notes, createdAt: new Date(f.date).toISOString() };
    if (edit) {
      s.updateExpense(edit.id, data);
    } else {
      s.addExpense(data);
    }
    setOpen(false);
    reset();
  };

  const del = (id: string) => {
    if (confirm('سيتم نقل المصروف إلى سلة المحذوفات. متابعة؟')) s.deleteExpense(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title mb-0">المصروفات</h1>
        <Button onClick={openAdd}><Plus size={20} />إضافة</Button>
      </div>

      <Card accent className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-small text-text-secondary">إجمالي المصروفات</span>
          <span className="text-financial text-danger">{fmt(totalExpenses)} <span className="text-small">{currency}</span></span>
        </div>
      </Card>

      {filtered.length === 0 ? <EmptyState message="لا توجد مصروفات" /> : (
        <div className="space-y-3">
          {filtered.map((e: any) => (
            <Card key={e.id} accent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-body">{e.title}</h3>
                  <p className="text-small text-text-secondary">{e.notes || '-'}</p>
                  <p className="text-small text-text-secondary">{dt(e.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(e)} className="flex items-center gap-1 px-3 py-1.5 bg-info/10 text-info rounded-btn text-small font-semibold"><Edit2 size={14} />تعديل</button>
                    <button onClick={() => del(e.id)} className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger rounded-btn text-small font-semibold"><Trash2 size={14} />حذف</button>
                  </div>
                  <span className="text-financial text-danger">{fmt(e.amount)} <span className="text-small">{currency}</span></span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => { if (hasChanges && !confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) return; setOpen(false); reset(); }} title={edit ? 'تعديل مصروف' : 'إضافة مصروف'}>
        <div className="space-y-3 pb-4">
          <Input label="العنوان" value={f.title} onChange={e => handleChange('title', e.target.value)} />
          <Input label="المبلغ" type="text" inputMode="decimal" value={f.amount ? fmt(+f.amount) : ''} onChange={e => handleChange('amount', e.target.value.replace(/,/g, ''))} />
          <div>
            <label className="block text-sm font-semibold mb-1">الصندوق</label>
            <select value={f.cashBoxId} onChange={e => handleChange('cashBoxId', e.target.value)} className="input-field">
              {s.cashBoxes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">التاريخ</label>
            <input type="date" value={f.date} onChange={e => handleChange('date', e.target.value)} className="input-field" dir="ltr" />
          </div>
          <Input label="الملاحظات" value={f.notes} onChange={e => handleChange('notes', e.target.value)} />
          <Button fullWidth onClick={save}>{edit ? 'تحديث' : 'حفظ'}</Button>
        </div>
      </Dialog>
    </div>
  );
      }
