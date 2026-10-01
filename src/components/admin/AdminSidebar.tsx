import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Bell,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';

interface AdminSidebarProps {
  currentTab: 'overview' | 'orders' | 'products' | 'customers' | 'settings';
  onSelectTab: (tab: 'overview' | 'orders' | 'products' | 'customers' | 'settings') => void;
  onExitToStore: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onExitToStore,
}) => {
  const { metrics, unreadNotifCount } = useAdmin();
  const { settings } = useStore();

  const menuItems: {
    id: 'overview' | 'orders' | 'products' | 'customers' | 'settings';
    label: string;
    icon: React.ElementType;
    badge?: number | string;
  }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: metrics.pendingOrders > 0 ? metrics.pendingOrders : undefined,
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: metrics.lowStockProducts > 0 ? `${metrics.lowStockProducts} low` : undefined,
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Store Customization', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0E2218] text-[#FAF7F2] flex-col justify-between border-r border-emerald-950 p-6 shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2A5A41] text-white flex items-center justify-center font-heading font-black text-xl shadow-xs">
              V
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white tracking-tight block">
                {settings.brandName || 'VERDANT'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#173627] text-emerald-300 shadow-xs border border-emerald-800'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront return button */}
        <div className="pt-6 border-t border-emerald-950/80 space-y-2">
          <button
            onClick={onExitToStore}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Store
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0E2218]/95 backdrop-blur-md border-t border-emerald-950 flex items-center justify-around p-2 text-[10px] font-bold text-stone-400">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors relative ${
                isActive ? 'text-emerald-400 font-extrabold' : 'hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
