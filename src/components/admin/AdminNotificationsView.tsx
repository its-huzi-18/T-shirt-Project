import React from 'react';
import { Bell, Check, Trash2, ArrowRight, ShoppingBag, AlertTriangle, UserCheck } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';

interface AdminNotificationsViewProps {
  onOpenOrder: (orderId: string) => void;
}

export const AdminNotificationsView: React.FC<AdminNotificationsViewProps> = ({ onOpenOrder }) => {
  const { notifications, unreadNotifCount, markNotificationAsRead, markAllNotificationsAsRead } = useAdmin();
  const { settings } = useStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-black font-heading text-[#173627] flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            Store Notifications & Real-Time Alerts
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Incoming customer orders, payment confirmations, and stock threshold warnings.
          </p>
        </div>

        {unreadNotifCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="py-2 px-4 rounded-xl bg-white border border-stone-200 text-xs font-bold text-emerald-800 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            Mark All as Read ({unreadNotifCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <Bell className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-heading font-black text-base text-[#173627]">No Notifications Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Whenever a customer places an order on HA Clothing, live alerts will appear here with instant sound chimes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isOrder = notif.type === 'new_order';
            const Icon = isOrder ? ShoppingBag : notif.type === 'low_stock' ? AlertTriangle : UserCheck;

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.isRead) markNotificationAsRead(notif.id);
                  if (notif.orderId) onOpenOrder(notif.orderId);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-white border-stone-200 opacity-75 hover:opacity-100 hover:border-stone-300'
                    : 'bg-emerald-50/70 border-emerald-300 shadow-xs hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isOrder
                        ? 'bg-emerald-900 text-emerald-300'
                        : notif.type === 'low_stock'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#173627]">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-stone-400 block">
                      {new Date(notif.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {notif.orderId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!notif.isRead) markNotificationAsRead(notif.id);
                      onOpenOrder(notif.orderId!);
                    }}
                    className="py-2 px-4 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all self-end sm:self-center shrink-0"
                  >
                    <span>View Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
