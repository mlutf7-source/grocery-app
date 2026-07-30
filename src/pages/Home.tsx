import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { ShoppingCart, ArrowDownToLine, Package, BarChart3 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">القائمة الرئيسية</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card variant="accent" className="!p-6 cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/sales')}>
          <div className="flex flex-col items-center gap-2">
            <ShoppingCart size={32} className="text-primary" />
            <span className="font-semibold text-body">بيع منتج</span>
          </div>
        </Card>
        <Card variant="accent" className="!p-6 cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/purchases')}>
          <div className="flex flex-col items-center gap-2">
            <ArrowDownToLine size={32} className="text-warning" />
            <span className="font-semibold text-body">شراء منتج</span>
          </div>
        </Card>
        <Card variant="accent" className="!p-6 cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/inventory')}>
          <div className="flex flex-col items-center gap-2">
            <Package size={32} className="text-info" />
            <span className="font-semibold text-body">المخزون</span>
          </div>
        </Card>
        <Card variant="accent" className="!p-6 cursor-pointer hover:shadow-card-hover" onClick={() => navigate('/reports')}>
          <div className="flex flex-col items-center gap-2">
            <BarChart3 size={32} className="text-success" />
            <span className="font-semibold text-body">التقارير</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
