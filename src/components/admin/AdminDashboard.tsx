import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminProvider } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminOverview } from './AdminOverview';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';

interface AdminDashboardProps {
  onExitToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitToStore }) => {
  const { isAdmin, currentUser, loginWithGoogle, demoAdminLogin, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'settings'>('overview');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // If not authenticated as admin, show secure access screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0E2218] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl p-8 shadow-2xl border border-emerald-950 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#173627] text-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800">
              Restricted Area
            </span>
            <h2 className="text-2xl font-black font-heading text-[#173627] mt-1">
              Store Administrator Access
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              This console is reserved for authorized workshop managers and store administrators.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={demoAdminLogin}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sign In as Administrator (Demo Mode)
            </button>

            <button
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-xs text-stone-700 transition-colors flex items-center justify-center gap-2"
            >
              Sign In with Google Account
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <button
              onClick={onExitToStore}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1.5 mx-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentTab('orders');
  };

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#F4F1EA] flex">
        {/* Left Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onExitToStore={onExitToStore}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
          <AdminHeader
            currentTab={currentTab}
            onExitToStore={onExitToStore}
            onOpenOrder={handleOpenOrder}
          />

          <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'overview' && (
              <AdminOverview
                onOpenOrder={handleOpenOrder}
                onNavigateTab={setCurrentTab}
                onOpenCreateProduct={() => setIsCreateProductOpen(true)}
              />
            )}

            {currentTab === 'orders' && (
              <AdminOrders
                selectedOrderId={selectedOrderId}
                onCloseOrderDetail={() => setSelectedOrderId(null)}
              />
            )}

            {currentTab === 'products' && (
              <AdminProducts
                isCreateModalOpen={isCreateProductOpen}
                onCloseCreateModal={() => setIsCreateProductOpen(false)}
              />
            )}

            {currentTab === 'customers' && <AdminCustomers />}

            {currentTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};
