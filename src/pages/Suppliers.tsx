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

export default function Suppliers() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [f, setF] = useState({ name: '', phone: '', address: '', notes: '' });
  const [hasChanges, setHasChanges] = useState(false);

  usePreventLeave(hasChanges);

  const filtered = [...s.suppliers].reverse().filter((sup: any) => sup.name.includes(search) || sup.phone?.includes(search));

  const reset = () => {
    setF({ name: '', phone: '', address: '', notes: '' });
    setEdit(null);
    setHasChanges(false);
  };

  const openAdd = () => { reset(); setOpen(true); };
  const openEdit = (sup: any) => {
    setEdit(sup);
    setF({ name: sup.name, phone: sup.phone || '', address: sup.address || '', notes: sup.notes || '' });
    setHasChanges(true);
    setOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setF({ ...f, [field]: value });
    setHasChanges(true);
  };

  const save = () => {
    if (!f.name) return;
    if (!edit && s.suppliers.find((sup: any) => sup.name === f.name)) {
      alert('يوجد مورد بنفس الاسم');
      return;
    }
    if (edit) {
      s.updateSupplier(edit.id, { ...f, updatedAt: new Date().toISOString() });
    } else {
      s.addSupplier({ ...f, balance: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setOpen(false);
    reset();
  };

  const del = (id: string) => {
    if (confirm('سيتم نقل المورد إلى سلة المحذوفات. متابعة؟')) s.deleteSupplier(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title mb-0">الموردين</h1>
        <Button onClick={openAdd}><Plus size={20} />إضافة</Button>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder="بحث عن مورد..." />
      {!filtered.length ? <EmptyState message="لا توجد موردين" /> : (
        <div className="space-y-3">
          {filtered.map((sup: any) => (
            <Card key={sup.id} accent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-body">{sup.name}</h3>
                  <p className="text-small text-text-secondary">{sup.phone || '-'}</p>
                  <p className="text-small text-text-secondary">{sup.address || '-'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(sup)} className="flex items-center gap-1 px-3 py-1.5 bg-info/10 text-info rounded-btn text-small font-semibold"><Edit2 size={14} />تعديل</button>
                    <button onClick={() => del(sup.id)} className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger rounded-btn text-small font-semibold"><Trash2 size={14} />حذف</button>
                  </div>
                  <span className={`text-financial ${sup.balance > 0 ? 'text-success' : sup.balance < 0 ? 'text-danger' : 'text-info'}`}>
                    {sup.balance > 0 ? `له ${fmt(sup.balance)}` : sup.balance < 0 ? `عليه ${fmt(Math.abs(sup.balance))}` : 'متزن'}
                    <span className="text-small">{currency}</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={open} onClose={() => { if (hasChanges && !confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) return; setOpen(false); reset(); }} title={edit ? 'تعديل مورد' : 'إضافة مورد'}>
        <div className="space-y-3 pb-4">
          <Input label="اسم المورد" value={f.name} onChange={e => handleChange('name', e.target.value)} />
          <Input label="الهاتف" type="tel" value={f.phone} onChange={e => handleChange('phone', e.target.value)} />
          <Input label="العنوان" value={f.address} onChange={e => handleChange('address', e.target.value)} />
          <Input label="الملاحظات" value={f.notes} onChange={e => handleChange('notes', e.target.value)} />
          <Button fullWidth onClick={save}>{edit ? 'تحديث' : 'حفظ'}</Button>
        </div>
      </Dialog>
    </div>
  );
            }
