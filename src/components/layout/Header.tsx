import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Home, ShoppingCart, ArrowDownToLine, BarChart3, Plus, X,
  Package, Users, Factory, Wallet, Receipt, Trash2, Settings,
  Bell, Sun, Moon, ArrowLeft
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// جميع الصفحات المتاحة للإضافة
const allPages = [
  { path: '/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
  { path: '/products', label: 'المنتجات', icon: Package },
  { path: '/inventory', label: 'المخزون', icon: Package },
  { path: '/customers', label: 'العملاء', icon: Users },
  { path: '/suppliers', label: 'الموردين', icon: Factory },
  { path: '/cashboxes', label: 'الصناديق', icon: Wallet },
  { path: '/expenses', label: 'المصروفات', icon: Receipt },
  { path: '/trash', label: 'المحذوفات', icon: Trash2 },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
];

// الأيقونات الأساسية الثابتة
const fixedItems = [
  { path: '/sales', label: 'بيع منتج', icon: ShoppingCart },
  { path: '/purchases', label: 'شراء منتج', icon: ArrowDownToLine },
  { path: '/reports', label: 'التقارير', icon: BarChart3 },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shortcuts, setShortcuts] = useState<string[]>(() => {
    const saved = localStorage.getItem('bakala-shortcuts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editOpen, setEditOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // بيانات المتجر من localStorage
  const storeName = localStorage.getItem('store-name') || 'البقالات';
  const storeOwner = localStorage.getItem('store-owner') || '';
  const storeLogo = localStorage.getItem('store-logo') || '';

  // تفعيل/إلغاء الوضع الليلي
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const saveShortcuts = (list: string[]) => {
    setShortcuts(list);
    localStorage.setItem('bakala-shortcuts', JSON.stringify(list));
  };

  const toggleShortcut = (path: string) => {
    if (shortcuts.includes(path)) {
      saveShortcuts(shortcuts.filter(s => s !== path));
    } else {
      saveShortcuts([...shortcuts, path]);
    }
  };

  return (
    <>
      {/* الهيدر العلوي */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border h-[60px] flex items-center justify-between px-4 shadow-sm">
        
        {/* زر الرجوع (يمين) */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary transition-colors"
        >
          <ArrowLeft size={22} />
        </button>

        {/* شعار واسم المتجر (الوسط) */}
        <div className="flex items-center gap-2">
          {storeLogo && (
            <img src={storeLogo} alt="شعار" className="w-8 h-8 rounded-full object-cover" />
          )}
          <div className="flex flex-col items-center">
            <h1 className="text-app-title font-bold text-text-primary leading-tight">
              {storeName}
            </h1>
            {storeOwner && (
              <span className="text-[10px] text-text-secondary">
                {storeOwner}
              </span>
            )}
          </div>
        </div>

        {/* زر الإشعارات + الوضع الليلي (يسار) */}
        <div className="flex items-center gap-2">
          <NavLink to="/notifications" className="relative p-2 rounded-lg hover:bg-primary/10 text-text-secondary transition-colors">
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface" />
          </NavLink>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary transition-colors"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      {/* الشريط الأفقي للأيقونات */}
      <nav className="fixed top-[60px] left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border h-[60px] flex items-center px-3 shadow-sm">
        
        {/* أيقونة الرئيسية ثابتة (أقصى يمين) */}
        <div className="flex-shrink-0 sticky right-0 bg-inherit z-10 pr-2 pl-4 shadow-left">
          <NavLink to="/" end>
            {({ isActive }) => (
              <Card variant="icon" className={`w-[48px] h-[48px] ${isActive ? '!border-2 !border-primary' : ''}`}>
                <Home size={20} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                  الرئيسية
                </span>
              </Card>
            )}
          </NavLink>
        </div>

        {/* باقي الأيقونات (قابلة للتمرير) */}
        <div className="flex gap-2 overflow-x-auto pr-4 scrollbar-hide flex-1">
          
          {/* الأيقونات الأساسية */}
          {fixedItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end className="flex-shrink-0">
                <Card variant="icon" className={`w-[48px] h-[48px] ${isActive ? '!border-2 !border-primary' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {item.label}
                  </span>
                </Card>
              </NavLink>
            );
          })}

          {/* الأيقونات المخصصة */}
          {shortcuts.map((path) => {
            const page = allPages.find(p => p.path === path);
            if (!page) return null;
            const isActive = location.pathname === path;
            const Icon = page.icon;
            return (
              <NavLink key={path} to={path} end className="flex-shrink-0">
                <Card variant="icon" className={`w-[48px] h-[48px] ${isActive ? '!border-2 !border-primary' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {page.label}
                  </span>
                </Card>
              </NavLink>
            );
          })}

          {/* زر تخصيص */}
          <button
            onClick={() => setEditOpen(true)}
            className="flex-shrink-0 flex flex-col items-center justify-center"
          >
            <Card variant="icon" className="w-[48px] h-[48px] border-2 border-dashed border-primary/30 bg-primary/5">
              <Plus size={20} className="text-primary" />
              <span className="text-[10px] font-semibold text-primary">تخصيص</span>
            </Card>
          </button>
        </div>
      </nav>

      {/* نافذة تخصيص الاختصارات */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="تخصيص الشريط">
        <div className="space-y-3 pb-4">
          <p className="text-small text-text-secondary">
            اختر الصفحات التي تريد إضافتها إلى الشريط العلوي.
          </p>
          <div className="flex flex-wrap gap-2">
            {shortcuts.length === 0 && <p className="text-small text-text-secondary">لا توجد اختصارات مضافة</p>}
            {shortcuts.map(path => {
              const page = allPages.find(p => p.path === path);
              if (!page) return null;
              const Icon = page.icon;
              return (
                <div key={path} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-light text-primary text-small">
                  <Icon size={14} />
                  <span>{page.label}</span>
                  <button onClick={() => toggleShortcut(path)} className="text-danger hover:bg-danger/10 rounded-full p-0.5"><X size={12} /></button>
                </div>
              );
            })}
          </div>
          <hr />
          <div>
            <h4 className="text-small font-bold mb-2">جميع الصفحات:</h4>
            <div className="flex flex-wrap gap-2">
              {allPages.map(page => {
                const Icon = page.icon;
                const selected = shortcuts.includes(page.path);
                return (
                  <button
                    key={page.path}
                    onClick={() => toggleShortcut(page.path)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-small transition-colors ${
                      selected ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-primary-light'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{page.label}</span>
                    {selected ? <X size={12} /> : <Plus size={12} />}
                  </button>
                );
              })}
            </div>
          </div>
          <Button fullWidth onClick={() => setEditOpen(false)}>تم</Button>
        </div>
      </Dialog>
    </>
  );
                         }
