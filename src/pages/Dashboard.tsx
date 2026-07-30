import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowDownToLine, Package, Users, Factory, Wallet, Receipt as ReceiptIcon, BarChart3 } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function Dashboard() {
  const s = useStore();
  const navigate = useNavigate();
  const currency = s.settings?.currency || 'ريال يمني';

  const totalCashBoxBalance = s.cashBoxes.reduce((sum: number, b: any) => sum + b.balance, 0);
  const totalCustomerDebt = s.customers.reduce((sum: number, c: any) => sum + Math.max(0, c.balance), 0);
  const totalSupplierDebt = s.suppliers.reduce((sum: number, sup: any) => sum + Math.max(0, sup.balance), 0);
  const totalSales = s.sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalPurchases = s.purchases.reduce((sum: number, p: any) => sum + p.total, 0);
  const totalExpenses = s.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const profit = totalSales - totalPurchases - totalExpenses;
  const productCount = s.products.length;
  const totalStockValue = s.products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0) * (p.lastPurchasePrice || p.purchasePrice || 0), 0);

  return (
    <div className="page-container">
      <h1 className="page-title">لوحة التحكم</h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/sales')}>
          <div className="text-center">
            <ShoppingCart size={24} className="text-primary mx-auto mb-1" />
            <p className="text-small text-text-secondary">إجمالي المبيعات</p>
            <p className="text-financial text-primary">{fmt(totalSales)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/purchases')}>
          <div className="text-center">
            <ArrowDownToLine size={24} className="text-warning mx-auto mb-1" />
            <p className="text-small text-text-secondary">إجمالي المشتريات</p>
            <p className="text-financial text-warning">{fmt(totalPurchases)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/inventory')}>
          <div className="text-center">
            <Package size={24} className="text-info mx-auto mb-1" />
            <p className="text-small text-text-secondary">عدد المنتجات</p>
            <p className="text-financial text-info">{productCount}</p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/inventory')}>
          <div className="text-center">
            <Package size={24} className="text-success mx-auto mb-1" />
            <p className="text-small text-text-secondary">قيمة المخزون</p>
            <p className="text-financial text-success">{fmt(totalStockValue)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/customers')}>
          <div className="text-center">
            <Users size={24} className="text-danger mx-auto mb-1" />
            <p className="text-small text-text-secondary">ديون العملاء</p>
            <p className="text-financial text-danger">{fmt(totalCustomerDebt)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/suppliers')}>
          <div className="text-center">
            <Factory size={24} className="text-success mx-auto mb-1" />
            <p className="text-small text-text-secondary">رصيد الموردين</p>
            <p className="text-financial text-success">{fmt(totalSupplierDebt)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/cashboxes')}>
          <div className="text-center">
            <Wallet size={24} className="text-primary mx-auto mb-1" />
            <p className="text-small text-text-secondary">رصيد الصناديق</p>
            <p className="text-financial text-primary">{fmt(totalCashBoxBalance)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>

        <Card variant="accent" className="cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/expenses')}>
          <div className="text-center">
            <ReceiptIcon size={24} className="text-danger mx-auto mb-1" />
            <p className="text-small text-text-secondary">إجمالي المصروفات</p>
            <p className="text-financial text-danger">{fmt(totalExpenses)} <span className="text-small">{currency}</span></p>
          </div>
        </Card>
      </div>

      <Card accent className="mb-4">
        <div className="text-center">
          <p className="text-small text-text-secondary">صافي الربح</p>
          <p className={`text-financial ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
            {fmt(profit)} <span className="text-small">{currency}</span>
          </p>
        </div>
      </Card>

      <div className="flex justify-center">
        <button onClick={() => navigate('/reports')} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-btn font-semibold">
          <BarChart3 size={20} />
          عرض التقارير الكاملة
        </button>
      </div>
    </div>
  );
              }
