import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[60px] pb-20">
        <Outlet />
      </main>
    </div>
  );
}
