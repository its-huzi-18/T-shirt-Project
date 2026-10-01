import React, { useState } from 'react';
import { Bell, Check, ExternalLink, ShieldCheck, X, ArrowRight, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  currentTab: string;
  onExitToStore: () => void;
  onOpenOrder: (orderId: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onExitToStore,
  onOpenOrder,
}) => {
  const { notifications, unreadNotifCount, markNotificationAsRead, markAllNotificationsAsRead, requestPushPermission } = useAdmin();
  const { currentUser } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className="h-16 sm:h-20 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-black font-heading text-[#173627] capitalize">
            {currentTab === 'overview'
              ? 'Executive Dashboard'
              : currentTab === 'orders'
              ? 'Order Fulfillment & Printing Queue'
              : currentTab === 'products'
              ? 'T-Shirt Catalog & Inventory'
              : currentTab === 'customers'
              ? 'Customer Directory'
              : 'Website Customization & Brand Settings'}
          </h1>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            Live Database
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Push permission trigger */}
          <button
            onClick={requestPushPermission}
            className="hidden md:flex items-center gap-1.5 py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors"
            title="Enable Desktop Push Alerts"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Alerts On</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-emerald-800" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-800" />
                      <h4 className="font-heading font-black text-sm text-[#173627]">
                        Notifications ({notifications.length})
                      </h4>
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 p-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400">
                        No notifications yet. New customer orders will chime here in real-time.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (!notif.isRead) markNotificationAsRead(notif.id);
                            if (notif.orderId) onOpenOrder(notif.orderId);
                            setNotifOpen(false);
                          }}
                          className={`p-3.5 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                            notif.isRead ? 'hover:bg-stone-50 opacity-70' : 'bg-emerald-50/60 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  notif.isRead ? 'bg-transparent' : 'bg-emerald-600'
                                }`}
                              />
                              <h5 className="font-bold text-xs text-[#173627]">{notif.title}</h5>
                            </div>
                            <p className="text-xs text-stone-600 pl-4">{notif.message}</p>
                            <span className="text-[10px] text-stone-400 pl-4 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {notif.orderId && (
                            <ArrowRight className="w-4 h-4 text-stone-400 hover:text-emerald-800 shrink-0 mt-1" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Live Store */}
          <button
            onClick={onExitToStore}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#173627] text-white hover:bg-[#11291E] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
        </div>
      </header>
    </>
  );
};
