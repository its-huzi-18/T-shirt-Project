import React, { useState, useMemo } from 'react';
import { Search, Users, Mail, Phone, ShoppingBag, DollarSign, Calendar, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { orders, customers } = useAdmin();
  const { settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);

  // Group customer metrics by email
  const aggregatedCustomers = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string;
        ordersCount: number;
        totalSpent: number;
        lastOrderDate: string;
        ordersList: Order[];
      }
    >();

    orders.forEach((o) => {
      const email = (o.customerEmail || 'guest@verdant.com').toLowerCase().trim();
      const existing = map.get(email);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
          existing.phone = o.customerPhone || existing.phone;
          existing.name = o.customerName || existing.name;
        }
        existing.ordersList.push(o);
      } else {
        map.set(email, {
          name: o.customerName || 'Customer',
          email,
          phone: o.customerPhone || 'N/A',
          ordersCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.createdAt,
          ordersList: [o],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredCustomers = aggregatedCustomers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const activeCustomer = selectedCustomerEmail
    ? aggregatedCustomers.find((c) => c.email === selectedCustomerEmail)
    : null;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, email, phone..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-hidden focus:border-[#173627]"
          />
        </div>

        <div className="text-xs text-stone-500 font-bold">
          Total Customers: {aggregatedCustomers.length}
        </div>
      </div>

      {/* Customers Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Users className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="font-heading font-black text-lg text-[#173627]">No Customer Records</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Customers will automatically appear here as they complete orders on your store.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Customer</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Last Order Date</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.email}
                    onClick={() => setSelectedCustomerEmail(cust.email)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{cust.name}</div>
                      <div className="text-[11px] text-stone-500">{cust.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{cust.phone}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {cust.ordersCount} order{cust.ordersCount > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      {settings.currencySymbol || '$'}{cust.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(cust.lastOrderDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerEmail(cust.email);
                        }}
                        className="py-1 px-3 bg-[#173627] text-white rounded-lg text-xs font-bold hover:bg-[#11291E]"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Modal */}
      <AnimatePresence>
        {activeCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomerEmail(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-200 z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-lg text-[#173627]">
                    {activeCustomer.name}
                  </h3>
                  <p className="text-xs text-stone-500">{activeCustomer.email} • {activeCustomer.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomerEmail(null)}
                  className="p-2 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-400 font-bold block uppercase">Lifetime Spending</span>
                    <span className="text-lg font-black text-[#173627]">
                      {settings.currencySymbol || '$'}{activeCustomer.totalSpent.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-400 font-bold block uppercase">Total Orders Placed</span>
                    <span className="text-lg font-black text-[#173627]">{activeCustomer.ordersCount}</span>
                  </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">
                    Order History
                  </h4>
                  <div className="divide-y divide-stone-100">
                    {activeCustomer.ordersList.map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#173627] block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} garments
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-stone-900 block">
                            {settings.currencySymbol || '$'}{ord.total.toFixed(2)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
