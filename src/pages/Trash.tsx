import { useState } from 'react';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Undo2, Trash2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function Trash() {
  const s = useStore();
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'منتجات' },
    { id: 'customers', label: 'عملاء' },
    { id: 'suppliers', label: 'موردين' },
    { id: 'cashBoxes', label: 'صناديق' },
    { id: 'sales', label: 'مبيعات' },
    { id: 'purchases', label: 'مشتريات' },
    { id: 'expenses', label: 'مصروفات' },
    { id: 'cashMovements', label: 'حركات نقدية' },
  ];

  const items = s.trash[activeTab] || [];

  const handleRestore = (id: string) => {
    if (confirm('هل تريد استعادة هذا العنصر؟')) {
      switch (activeTab) {
        case 'products': s.restoreProduct(id); break;
        case 'customers': s.restoreCustomer(id); break;
        case 'suppliers': s.restoreSupplier(id); break;
        case 'cashBoxes': s.restoreCashBox(id); break;
        case 'sales': s.restoreSale(id); break;
        case 'purchases': s.restorePurchase(id); break;
        case 'expenses': s.restoreExpense(id); break;
        case 'cashMovements': s.restoreCashMovement(id); break;
        default: break;
      }
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm('هل أنت متأكد من الحذف النهائي؟ لا يمكن التراجع عن هذا الإجراء.')) {
      switch (activeTab) {
        case 'products': s.permanentDeleteProduct(id); break;
        case 'customers': s.permanentDeleteCustomer(id); break;
        case 'suppliers': s.permanentDeleteSupplier(id); break;
        case 'cashBoxes': s.permanentDeleteCashBox(id); break;
        case 'sales': s.permanentDeleteSale(id); break;
        case 'purchases': s.permanentDeletePurchase(id); break;
        case 'expenses': s.permanentDeleteExpense(id); break;
        case 'cashMovements': s.permanentDeleteCashMovement(id); break;
        default: break;
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">سلة المحذوفات</h1>

      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-btn text-small font-semibold whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary text-white' : 'bg-primary-light text-primary hover:bg-primary/20'
            }`}
          >
            {tab.label}
            {s.trash[tab.id]?.length > 0 && <span className="ml-1 bg-danger text-white rounded-full px-2 py-0.5 text-xs">{s.trash[tab.id].length}</span>}
          </button>
        ))}
      </div>

      {items.length === 0 ? <EmptyState message="لا توجد عناصر محذوفة في هذا القسم" /> : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <Card key={item.id} className="!p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-body">{item.name || item.title || `#${item.invoiceNo || item.id.slice(-6)}`}</p>
                  {item.deletedAt && <p className="text-small text-text-secondary">حذف في: {dt(item.deletedAt)}</p>}
                  {item.total && <p className="text-small text-text-secondary">المبلغ: {fmt(item.total)}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRestore(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success rounded-btn text-small font-semibold">
                    <Undo2 size={14} /> استعادة
                  </button>
                  <button onClick={() => handlePermanentDelete(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger rounded-btn text-small font-semibold">
                    <Trash2 size={14} /> حذف نهائي
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
          }
