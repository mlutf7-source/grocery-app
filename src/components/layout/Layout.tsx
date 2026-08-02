import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* تم ضبط المسافة العلوية لتتناسب مع الهيدر والشريط الأفقي */}
      <main className="pt-[120px] pb-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}
