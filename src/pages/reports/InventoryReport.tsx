import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { sharePdfFromElement } from '@/utils/pdfShare';
import { Printer, Share2 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function InventoryReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';

  const products = [...s.products].reverse();

  const totalItems = products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0), 0);
  const totalValue = products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0) * (p.lastPurchasePrice || p.purchasePrice || 0), 0);

  const reportId = 'inventory-report';

  const formatStock = (p: any) => {
    const qty = p.stockQuantity || 0;
    if (p.unit === 'كرتون' && p.boxQty) {
      const cartons = Math.floor(qty / p.boxQty);
      const pieces = qty % p.boxQty;
      return `${cartons} كرتون + ${pieces} حبة`;
    }
    return `${fmt(qty)} حبة`;
  };

  return (
    <div className="space-y-4" id={reportId}>
      <div className="flex justify-end gap-2">
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المخزون')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Printer size={14} /> طباعة
        </button>
        <button onClick={() => sharePdfFromElement(reportId, 'تقرير المخزون')} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold">
          <Share2 size={14} /> مشاركة
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">عدد المنتجات</p>
          <p className="text-financial text-info">{products.length}</p>
        </Card>
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">إجمالي الحبات</p>
          <p className="text-financial text-primary">{fmt(totalItems)}</p>
        </Card>
        <Card variant="accent" className="!p-3">
          <p className="text-small text-text-secondary">قيمة المخزون</p>
          <p className="text-financial text-success">{fmt(totalValue)} <span className="text-small">{currency}</span></p>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-card-title">قائمة المنتجات</h3>
        {products.length === 0 ? <p className="text-small text-text-secondary text-center">لا توجد منتجات في المخزون.</p> : products.map((p: any) => (
          <Card key={p.id} className="!p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-body">{p.name}</p>
                <p className="text-small text-text-secondary">سعر الشراء: {fmt(p.lastPurchasePrice || p.purchasePrice || 0)}</p>
                <p className="text-small text-text-secondary">سعر البيع: {fmt(p.sellingPrice || 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-financial text-primary">{fmt(p.stockQuantity || 0)}</p>
                <p className="text-small text-text-secondary">حبة</p>
                {p.unit === 'كرتون' && p.boxQty && <p className="text-small text-text-secondary">{formatStock(p)}</p>}
                <p className="text-small text-info">القيمة: {fmt((p.stockQuantity || 0) * (p.lastPurchasePrice || p.purchasePrice || 0))} <span className="text-small">{currency}</span></p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
        }
