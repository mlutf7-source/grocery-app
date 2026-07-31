import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* تمت زيادة المسافة العلوية لاستيعاب الهيدر + الشريط */}
      <main className="pt-[120px] pb-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}
