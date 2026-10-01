import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  Truck,
  X,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Save,
  Check,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';

interface AdminOrdersProps {
  selectedOrderId?: string | null;
  onCloseOrderDetail?: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  selectedOrderId,
  onCloseOrderDetail,
}) => {
  const { orders, updateOrderStatus, updatePaymentStatus, updateAdminNotes, deleteOrder } = useAdmin();
  const { settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [internalNotes, setInternalNotes] = useState('');

  // Sync selected order if passed from parent
  React.useEffect(() => {
    if (selectedOrderId) {
      const found = orders.find((o) => o.id === selectedOrderId || o.orderNumber === selectedOrderId);
      if (found) {
        setActiveModalOrder(found);
        setInternalNotes(found.adminNotes || '');
      }
    }
  }, [selectedOrderId, orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Filter by status tab
      if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;

      // Filter by search query (order ID, name, phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleOpenOrder = (o: Order) => {
    setActiveModalOrder(o);
    setInternalNotes(o.adminNotes || '');
  };

  const handleSaveNotes = async () => {
    if (!activeModalOrder) return;
    await updateAdminNotes(activeModalOrder.id, internalNotes);
  };

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Printed',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Customer, Phone..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-hidden focus:border-[#173627]"
          />
        </div>

        {/* Filter Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'Pending', 'Processing', 'Printed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
            const count = st === 'all' ? orders.length : orders.filter((o) => o.orderStatus === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-[#173627] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <FileText className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="font-heading font-black text-lg text-[#173627]">No Orders Found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No customer orders match your active search or filter selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Order Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Garments</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleOpenOrder(order)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-[#173627]">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500">{order.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4">
                      {order.items.map((it) => `${it.quantity}x ${it.size}`).join(', ')}
                    </td>
                    <td className="py-4 px-4 font-black text-stone-900">
                      {settings.currencySymbol || '$'}{order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 uppercase text-[10px] font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Printed'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenOrder(order);
                        }}
                        className="py-1 px-3 bg-[#173627] text-white rounded-lg text-xs font-bold hover:bg-[#11291E]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {activeModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveModalOrder(null);
                if (onCloseOrderDetail) onCloseOrderDetail();
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-200 z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-[#173627]">
                      {activeModalOrder.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {activeModalOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Placed on {new Date(activeModalOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs font-bold flex items-center gap-1 border border-stone-200"
                    title="Print Packing Slip"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Slip</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModalOrder(null);
                      if (onCloseOrderDetail) onCloseOrderDetail();
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Status Switcher Action Bar */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                    Update Workflow Status
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateOrderStatus(activeModalOrder.id, st);
                          setActiveModalOrder({ ...activeModalOrder, orderStatus: st });
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                          activeModalOrder.orderStatus === st
                            ? 'bg-[#173627] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs">
                    <span className="font-bold text-stone-600">Payment Status:</span>
                    {(['pending', 'paid', 'refunded'] as PaymentStatus[]).map((ps) => (
                      <button
                        key={ps}
                        onClick={() => {
                          updatePaymentStatus(activeModalOrder.id, ps);
                          setActiveModalOrder({ ...activeModalOrder, paymentStatus: ps });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                          activeModalOrder.paymentStatus === ps
                            ? 'bg-emerald-900 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {ps}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer & Shipping info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block">
                      Customer Profile
                    </span>
                    <p className="text-sm font-bold text-stone-900">{activeModalOrder.customerName}</p>
                    <p className="flex items-center gap-2 text-stone-600">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      {activeModalOrder.customerEmail}
                    </p>
                    <p className="flex items-center gap-2 text-stone-600">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {activeModalOrder.customerPhone}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block">
                      Delivery Destination
                    </span>
                    <p className="flex items-start gap-2 text-stone-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                      {activeModalOrder.address}
                    </p>
                    <p className="text-stone-600 pl-5">
                      {activeModalOrder.city} {activeModalOrder.postalCode ? `, ${activeModalOrder.postalCode}` : ''}
                    </p>
                    {activeModalOrder.customerNotes && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                        <strong>Customer Note:</strong> {activeModalOrder.customerNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered T-Shirts */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
                  <span className="font-bold uppercase tracking-wider text-stone-400 text-xs block">
                    Ordered Apparel Items ({activeModalOrder.items.length})
                  </span>
                  <div className="divide-y divide-stone-100">
                    {activeModalOrder.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#173627]">{item.productName}</h4>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              Size: <strong>{item.size}</strong> • Color: <strong>{item.colorName}</strong> • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-stone-900">
                          {settings.currencySymbol || '$'}{item.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-black text-[#173627]">
                    <span>Total Order Amount</span>
                    <span>{settings.currencySymbol || '$'}{activeModalOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                    Internal Workshop Notes
                  </span>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="e.g. Printed on 280 GSM blanks, packed with sticker pack..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-[#173627]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotes}
                      className="py-1.5 px-4 bg-[#173627] text-white rounded-xl text-xs font-bold hover:bg-[#11291E] flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Internal Note
                    </button>
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
