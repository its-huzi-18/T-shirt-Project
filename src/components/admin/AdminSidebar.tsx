import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Bell,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'products'
  | 'categories'
  | 'customers'
  | 'notifications'
  | 'customization'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitToStore: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onExitToStore,
  onLogout,
}) => {
  const { metrics, unreadNotifCount } = useAdmin();
  const { settings } = useStore();

  const menuItems: {
    id: AdminTab;
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
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'customers', label: 'Customers', icon: Users },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
    { id: 'customization', label: 'Website Customization', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-68 bg-[#0E2218] text-[#FAF7F2] flex-col justify-between border-r border-emerald-950 p-6 shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="pb-4 border-b border-emerald-950">
            <BrandLogo size="md" textColor="text-white" />
            <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] pl-1">
              Admin Command Console
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
                      ? 'bg-[#173627] text-[#D4AF37] shadow-xs border border-emerald-800'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.id === 'notifications'
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Storefront & Logout */}
        <div className="pt-6 border-t border-emerald-950/80 space-y-2">
          <button
            onClick={onExitToStore}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Store
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 hover:text-rose-100 text-xs font-bold uppercase tracking-wider transition-all border border-rose-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out (Logout)
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0E2218]/95 backdrop-blur-md border-t border-emerald-950 flex items-center justify-around p-2 text-[10px] font-bold text-stone-400">
        {[
          { id: 'overview', label: 'Home', icon: LayoutDashboard },
          { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: metrics.pendingOrders },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'categories', label: 'Categories', icon: Layers },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotifCount },
          { id: 'customization', label: 'Brand', icon: Palette },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as AdminTab)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors relative ${
                isActive ? 'text-[#D4AF37] font-extrabold' : 'hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
