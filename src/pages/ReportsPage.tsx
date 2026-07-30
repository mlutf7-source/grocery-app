import { useState } from 'react';
import Card from '@/components/ui/Card';
import { BarChart3, Users, Factory, Wallet, Receipt, ShoppingCart, ArrowDownToLine, Package } from 'lucide-react';
import CustomerReport from './reports/CustomerReport';
import SupplierReport from './reports/SupplierReport';
import CashBoxReport from './reports/CashBoxReport';
import SalesReport from './reports/SalesReport';
import PurchasesReport from './reports/PurchasesReport';
import InventoryReport from './reports/InventoryReport';
import ProfitReport from './reports/ProfitReport';
import ExpensesReport from './reports/ExpensesReport';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');

  const tabs = [
    { id: 'sales', label: 'المبيعات', icon: ShoppingCart },
    { id: 'purchases', label: 'المشتريات', icon: ArrowDownToLine },
    { id: 'inventory', label: 'المخزون', icon: Package },
    { id: 'customers', label: 'العملاء', icon: Users },
    { id: 'suppliers', label: 'الموردين', icon: Factory },
    { id: 'cashboxes', label: 'الصناديق', icon: Wallet },
    { id: 'expenses', label: 'المصروفات', icon: Receipt },
    { id: 'profit', label: 'الأرباح', icon: BarChart3 },
  ];

  const renderReport = () => {
    switch (activeTab) {
      case 'sales': return <SalesReport />;
      case 'purchases': return <PurchasesReport />;
      case 'inventory': return <InventoryReport />;
      case 'customers': return <CustomerReport />;
      case 'suppliers': return <SupplierReport />;
      case 'cashboxes': return <CashBoxReport />;
      case 'expenses': return <ExpensesReport />;
      case 'profit': return <ProfitReport />;
      default: return null;
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">التقارير</h1>
      
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-btn text-small font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-primary-light text-primary hover:bg-primary/20'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Card accent className="!p-4">
        {renderReport()}
      </Card>
    </div>
  );
}
