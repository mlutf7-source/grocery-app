import { useState } from 'react';
import { useStore } from '@/store';
import { usePreventLeave } from '@/hooks/usePreventLeave';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SearchInput from '@/components/ui/SearchInput';
import Dialog from '@/components/ui/Dialog';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function Customers() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [f, setF] = useState({ name: '', phone: '', address: '', notes: '' });
  const [hasChanges, setHasChanges] = useState(false);

  usePreventLeave(hasChanges);

  const filtered = [...s.customers].reverse().filter((c: any) => c.name.includes(search) || c.phone?.includes(search));

  const reset = () => {
    setF({ name: '', phone: '', address: '', notes: '' });
    setEdit(null);
    setHasChanges(false);
  };

  const openAdd = () => { reset(); setOpen(true); };
  const openEdit = (c: any) => {
    setEdit(c);
    setF({ name: c.name, phone: c.phone || '', address: c.address || '', notes: c.notes || '' });
    setHasChanges(true);
    setOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setF({ ...f, [field]: value });
    setHasChanges(true);
  };

  const save = () => {
    if (!f.name) return;
    if (!edit && s.customers.find((c: any) => c.name === f.name)) {
      alert('يوجد عميل بنفس الاسم');
      return;
    }
    if (edit) {
      s.updateCustomer(edit.id, { ...f, updatedAt: new Date().toISOString() });
    } else {
      s.addCustomer({ ...f, balance: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setOpen(false);
    reset();
  };

  const del = (id: string) => {
    if (confirm('سيتم نقل العميل إلى سلة المحذوفات. متابعة؟')) s.deleteCustomer(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title mb-0">العملاء</h1>
        <Button onClick={openAdd}><Plus size={20} />إضافة</Button>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder="بحث عن عميل..." />
      {!filtered.length ? <EmptyState message="لا توجد عملاء" /> : (
        <div className="space-y-3">
          {filtered.map((c: any) => (
            <Card key={c.id} accent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-body">{c.name}</h3>
                  <p className="text-small text-text-secondary">{c.phone || '-'}</p>
                  <p className="text-small text-text-secondary">{c.address || '-'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="flex items-center gap-1 px-3 py-1.5 bg-info/10 text-info rounded-btn text-small font-semibold"><Edit2 size={14} />تعديل</button>
                    <button onClick={() => del(c.id)} className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger rounded-btn text-small font-semibold"><Trash2 size={14} />حذف</button>
                  </div>
                  <span className={`text-financial ${c.balance > 0 ? 'text-danger' : c.balance < 0 ? 'text-success' : 'text-info'}`}>
                    {c.balance > 0 ? `عليه ${fmt(c.balance)}` : c.balance < 0 ? `له ${fmt(Math.abs(c.balance))}` : 'متزن'}
                    <span className="text-small">{currency}</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={open} onClose={() => { if (hasChanges && !confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) return; setOpen(false); reset(); }} title={edit ? 'تعديل عميل' : 'إضافة عميل'}>
        <div className="space-y-3 pb-4">
          <Input label="اسم العميل" value={f.name} onChange={e => handleChange('name', e.target.value)} />
          <Input label="الهاتف" type="tel" value={f.phone} onChange={e => handleChange('phone', e.target.value)} />
          <Input label="العنوان" value={f.address} onChange={e => handleChange('address', e.target.value)} />
          <Input label="الملاحظات" value={f.notes} onChange={e => handleChange('notes', e.target.value)} />
          <Button fullWidth onClick={save}>{edit ? 'تحديث' : 'حفظ'}</Button>
        </div>
      </Dialog>
    </div>
  );
    }
