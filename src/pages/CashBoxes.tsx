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

export default function CashBoxes() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [selectedId, setSelectedId] = useState('default-cash-box');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [f, setF] = useState({ name: '', balance: '' });
  const [hasChanges, setHasChanges] = useState(false);

  usePreventLeave(hasChanges);

  const selected = s.cashBoxes.find((b: any) => b.id === selectedId);
  const movements = s.cashMovements.filter((m: any) => m.cashBoxId === selectedId).reverse();

  const reset = () => {
    setF({ name: '', balance: '' });
    setEdit(null);
    setHasChanges(false);
  };

  const openAdd = () => { reset(); setOpen(true); };
  const openEdit = (box: any) => {
    setEdit(box);
    setF({ name: box.name, balance: box.balance.toString() });
    setHasChanges(true);
    setOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setF({ ...f, [field]: value });
    setHasChanges(true);
  };

  const save = () => {
    if (!f.name) return;
    if (edit) {
      s.updateCashBox(edit.id, { name: f.name, updatedAt: new Date().toISOString() });
    } else {
      s.addCashBox({ name: f.name, balance: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setOpen(false);
    reset();
  };

  const del = (id: string) => {
    if (id === 'default-cash-box') { alert('لا يمكن حذف الصندوق الرئيسي'); return; }
    if (confirm('سيتم نقل الصندوق إلى سلة المحذوفات. متابعة؟')) s.deleteCashBox(id);
  };

  return (
    <div className="page-container">
      <h1 className="page-title mb-4">الصناديق</h1>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">اختر الصندوق</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="input-field">
          {s.cashBoxes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {selected && (
        <Card accent className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-small text-text-secondary">رصيد الصندوق</span>
              <p className="text-financial text-primary">{fmt(selected.balance)} <span className="text-small">{currency}</span></p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="small" onClick={() => openEdit(selected)}><Edit2 size={14} />تعديل</Button>
              {selected.id !== 'default-cash-box' && <Button variant="danger" size="small" onClick={() => del(selected.id)}><Trash2 size={14} />حذف</Button>}
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={openAdd}><Plus size={18} />صندوق جديد</Button>
      </div>

      <h2 className="text-card-title mb-3">آخر الحركات</h2>
      {movements.length === 0 ? <EmptyState message="لا توجد حركات لهذا الصندوق" /> : (
        <div className="space-y-2">
          {movements.slice(0, 20).map((m: any) => (
            <Card key={m.id} className="!py-2 !px-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-small font-semibold">{m.description}</p>
                  <p className="text-small text-text-secondary">{dt(m.createdAt)}</p>
                </div>
                <span className={`text-financial ${m.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                  {m.type === 'deposit' ? '+' : '-'}{fmt(m.amount)} <span className="text-small">{currency}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => { if (hasChanges && !confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) return; setOpen(false); reset(); }} title={edit ? 'تعديل صندوق' : 'إضافة صندوق'}>
        <div className="space-y-3 pb-4">
          <Input label="اسم الصندوق" value={f.name} onChange={e => handleChange('name', e.target.value)} />
          <Button fullWidth onClick={save}>{edit ? 'تحديث' : 'حفظ'}</Button>
        </div>
      </Dialog>
    </div>
  );
            }
