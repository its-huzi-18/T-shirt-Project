import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  TrendingUp,
  ArrowRight,
  Printer,
  Truck,
  Plus,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

interface AdminOverviewProps {
  onOpenOrder: (orderId: string) => void;
  onNavigateTab: (tab: 'overview' | 'orders' | 'products' | 'customers' | 'settings') => void;
  onOpenCreateProduct: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onOpenOrder,
  onNavigateTab,
  onOpenCreateProduct,
}) => {
  const { orders, metrics, updateOrderStatus } = useAdmin();
  const { settings, products } = useStore();

  const recentOrders = orders.slice(0, 5);

  // Status pills helper
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Printed':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'Shipped':
        return 'bg-cyan-100 text-cyan-900 border-cyan-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#173627] to-[#0E2218] text-white shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Studio Workshop Command
          </span>
          <h2 className="text-2xl font-black font-heading mt-0.5">Welcome, Studio Administrator</h2>
          <p className="text-xs text-stone-300 mt-1 max-w-lg">
            Manage live print queues, process customer orders, adjust inventory, and customize store settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCreateProduct}
            className="py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#C2A24D] text-stone-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New T-Shirt
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/15"
          >
            Manage All Orders
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-heading text-[#173627]">
              {settings.currencySymbol || '$'}{metrics.totalRevenue.toFixed(2)}
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">Live customer transactions</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-heading text-[#173627]">
              {metrics.totalOrders}
            </span>
            <p className="text-[11px] text-stone-500 font-semibold mt-1">
              {metrics.deliveredOrders} delivered • {metrics.pendingOrders} pending
            </p>
          </div>
        </div>

        {/* Studio Printing Queue */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Print Queue</span>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-heading text-[#173627]">
              {metrics.processingOrders}
            </span>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">Confirmed & in print studio</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Low Stock Blanks</span>
            <div className={`p-2.5 rounded-xl ${metrics.lowStockProducts > 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-heading text-[#173627]">
              {metrics.lowStockProducts}
            </span>
            <p className="text-[11px] text-stone-500 font-semibold mt-1">
              {metrics.totalProducts} total catalog products
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Revenue & Order Volume SVG */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-heading font-black text-base text-[#173627]">
                Revenue & Sales Momentum
              </h3>
              <p className="text-xs text-stone-400">Aggregated order performance curve</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              30 Days
            </span>
          </div>

          {/* SVG Visual Graph */}
          <div className="h-56 w-full flex flex-col justify-end relative pt-6">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#173627" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#173627" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f0ece4" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f0ece4" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f0ece4" strokeDasharray="4 4" />

              {/* Area */}
              <path
                d="M 10 130 Q 80 110, 150 90 T 280 60 T 400 35 L 490 20 L 490 150 L 10 150 Z"
                fill="url(#chartGradient)"
              />
              {/* Trend Line */}
              <path
                d="M 10 130 Q 80 110, 150 90 T 280 60 T 400 35 L 490 20"
                fill="none"
                stroke="#173627"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { cx: 10, cy: 130 },
                { cx: 150, cy: 90 },
                { cx: 280, cy: 60 },
                { cx: 400, cy: 35 },
                { cx: 490, cy: 20 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="5"
                  className="fill-[#D4AF37] stroke-white stroke-2"
                />
              ))}
            </svg>

            {/* Labels */}
            <div className="flex justify-between text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-100">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Peak Drop)</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Order Status Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-[#173627]">
              Order Status Distribution
            </h3>
            <p className="text-xs text-stone-400">Fulfillment pipeline breakdown</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Delivered / Completed</span>
                <span>{metrics.deliveredOrders}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${metrics.totalOrders > 0 ? (metrics.deliveredOrders / metrics.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Printing & Processing</span>
                <span>{metrics.processingOrders}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{
                    width: `${metrics.totalOrders > 0 ? (metrics.processingOrders / metrics.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Pending Approval</span>
                <span>{metrics.pendingOrders}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${metrics.totalOrders > 0 ? (metrics.pendingOrders / metrics.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Cancelled</span>
                <span>{metrics.cancelledOrders}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${metrics.totalOrders > 0 ? (metrics.cancelledOrders / metrics.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#173627] hover:bg-stone-50 transition-colors text-center"
          >
            Inspect Detailed Orders Queue
          </button>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-heading font-black text-base text-[#173627]">Recent Customer Orders</h3>
            <p className="text-xs text-stone-400">Click any order to manage printing or shipping</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            All Orders <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-stone-400">
            No orders received yet. Place an order on the storefront to test live real-time ingestion.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#173627]">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-bold text-stone-900">{o.customerName}</div>
                      <div className="text-[10px] text-stone-400">{o.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {o.items.length} piece{o.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {settings.currencySymbol || '$'}{o.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold">
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(o.orderStatus)}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenOrder(o.id)}
                        className="py-1 px-3 bg-[#173627] text-white rounded-lg font-bold text-[11px] hover:bg-[#11291E] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
