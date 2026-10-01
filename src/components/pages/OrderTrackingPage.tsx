import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  Home,
  AlertCircle,
  Phone,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onSelectProduct?: (productId: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ initialOrderNumber }) => {
  const { fetchOrderForTracking, settings } = useStore();
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const orderStages: { status: OrderStatus; label: string; icon: React.ElementType; description: string }[] = [
    {
      status: 'Pending',
      label: 'Order Placed',
      icon: Clock,
      description: 'Your order was received and logged into our queue.',
    },
    {
      status: 'Confirmed',
      label: 'Order Confirmed',
      icon: CheckCircle2,
      description: 'Garment blanks inspected and queued for screen printing.',
    },
    {
      status: 'Processing',
      label: 'Studio Processing',
      icon: Package,
      description: 'Color separation, emulsion screens, and ink mixing active.',
    },
    {
      status: 'Printed',
      label: 'Printed & Cured',
      icon: Printer,
      description: 'Heavyweight print cured through tunnel dryer and quality inspected.',
    },
    {
      status: 'Shipped',
      label: 'Shipped / In Transit',
      icon: Truck,
      description: 'Handed to courier for doorstep delivery.',
    },
    {
      status: 'Delivered',
      label: 'Delivered',
      icon: Home,
      description: 'Safely delivered to your address. Enjoy your threads!',
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) {
      setErrorMessage('Please enter your Order Reference (e.g. ORD-2026-123456)');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setSearched(true);

    try {
      const result = await fetchOrderForTracking(orderNumberInput, phoneInput);
      if (result) {
        setOrder(result);
      } else {
        setOrder(null);
        setErrorMessage(
          'No order found matching this reference and phone number. Please check your order confirmation details.'
        );
      }
    } catch {
      setErrorMessage('Could not retrieve tracking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    const idx = orderStages.findIndex((s) => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = order ? getStageIndex(order.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
          Real-time Studio & Delivery Status
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#173627]">
          Track Your Custom Apparel
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Enter your order reference code and the phone number provided at checkout to track real-time printing and delivery stages.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Order Reference Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="e.g. ORD-2026-102948"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm uppercase font-mono font-bold focus:outline-hidden focus:border-[#173627]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Phone Number (Verification)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Phone number on order"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching Studio Records...' : 'Track Order Progress'}
        </button>
      </form>

      {/* Order Status Display */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-8"
        >
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Order Tracking Status
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-[#173627] mt-0.5">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} for {order.customerName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`py-1.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider ${
                  order.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.orderStatus === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                Current Status: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline */}
          {order.orderStatus === 'Cancelled' ? (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-800">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
              <h4 className="font-bold text-base">This Order Has Been Cancelled</h4>
              <p className="text-xs text-rose-600 mt-1">
                If you have questions, please reach out to our studio at {settings.contactEmail}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-900/20 space-y-8">
                {orderStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isDone = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage.status} className="relative group">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#173627] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-[#D4AF37] text-stone-900 ring-4 ring-amber-100 font-bold scale-110'
                            : 'bg-stone-200 text-stone-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-[#173627] text-base'
                                : isDone
                                ? 'text-stone-800'
                                : 'text-stone-400'
                            }`}
                          >
                            {stage.label}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed max-w-lg">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery & Items details */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider block">Destination</span>
              <p className="font-bold text-stone-800">{order.address}</p>
              <p className="text-stone-600">{order.city}, {order.postalCode || ''}</p>
              <p className="text-stone-600 font-medium">Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 space-y-2">
              <span className="font-bold text-stone-400 uppercase tracking-wider block">Items In Package</span>
              <div className="space-y-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-700">
                    <span className="truncate pr-2 font-medium">
                      {it.quantity}x {it.productName} ({it.size}, {it.colorName})
                    </span>
                    <span className="font-bold shrink-0">
                      {settings.currencySymbol || '$'}{it.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty prompt */}
      {!order && searched && !loading && (
        <div className="mt-8 text-center text-xs text-stone-500">
          Need assistance with your tracking? Email us at <strong className="text-stone-800">{settings.contactEmail}</strong>
        </div>
      )}
    </div>
  );
};
