import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const storeName = localStorage.getItem('store-name') || 'البقالات';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between h-[60px]">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/')} className="text-primary hover:bg-primary/10 p-2 rounded-lg">
          <Home size={20} />
        </button>
        <h1 className="text-app-title font-bold text-text-primary">{storeName}</h1>
      </div>
    </header>
  );
}
