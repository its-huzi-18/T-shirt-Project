import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminProvider } from '../../context/AdminContext';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminOverview } from './AdminOverview';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminCustomers } from './AdminCustomers';
import { AdminNotificationsView } from './AdminNotificationsView';
import { AdminSettings } from './AdminSettings';
import { AdminLoginView } from './AdminLoginView';

interface AdminDashboardProps {
  onExitToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitToStore }) => {
  const { isAdmin, adminLogout } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // If not authenticated as admin, show professional login screen
  if (!isAdmin) {
    return (
      <AdminLoginView
        onSuccess={() => setCurrentTab('overview')}
        onExitToStore={onExitToStore}
      />
    );
  }

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentTab('orders');
  };

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#F4F1EA] flex">
        {/* Left Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onExitToStore={onExitToStore}
          onLogout={handleLogout}
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
                onNavigateTab={(tab) => setCurrentTab(tab as AdminTab)}
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

            {currentTab === 'categories' && <AdminCategories />}

            {currentTab === 'customers' && <AdminCustomers />}

            {currentTab === 'notifications' && (
              <AdminNotificationsView onOpenOrder={handleOpenOrder} />
            )}

            {currentTab === 'customization' && (
              <AdminSettings initialSection="customization" />
            )}

            {currentTab === 'settings' && (
              <AdminSettings initialSection="settings" />
            )}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};
