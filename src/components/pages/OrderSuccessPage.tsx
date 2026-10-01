import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
  Printer,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

interface OrderSuccessPageProps {
  orderId: string;
  orderNumber: string;
  onTrackOrder: (orderNumber: string) => void;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  orderNumber,
  onTrackOrder,
  onContinueShopping,
}) => {
  const { settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Fire festive confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#173627', '#D4AF37', '#2A5A41', '#E1EFE6'],
    });

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const d = await getDoc(doc(db, 'orders', orderId));
        if (d.exists()) {
          setOrder(d.data() as Order);
        }
      } catch (err) {
        console.warn('Error fetching placed order:', err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const deliveryEstStart = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const deliveryEstEnd = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
          Payment & Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#173627]">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          We have received your custom apparel order. Our screen printing studio is preparing your pieces with archival craftsmanship.
        </p>

        {/* Order Number Badge */}
        <div className="pt-2">
          <span className="inline-block py-2 px-5 rounded-2xl bg-[#173627] text-white font-mono font-bold text-sm tracking-wider shadow-md">
            Order Reference: {orderNumber}
          </span>
        </div>
      </div>

      {/* Delivery Estimation Card */}
      <div className="mt-10 p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estimated Delivery Window</h4>
            <p className="text-base font-black text-[#173627]">{deliveryEstStart} – {deliveryEstEnd}</p>
          </div>
        </div>

        <button
          onClick={() => onTrackOrder(orderNumber)}
          className="w-full sm:w-auto py-2.5 px-5 bg-emerald-900 text-emerald-100 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-950 transition-colors flex items-center justify-center gap-1.5"
        >
          Track Live Status
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Order Details Recap */}
      {order && (
        <div className="mt-8 bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <h3 className="font-heading font-black text-lg text-[#173627]">Order Receipt</h3>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>

          {/* Customer & Shipping info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider block">Customer Details</span>
              <p className="font-bold text-stone-900">{order.customerName}</p>
              <p className="text-stone-600">{order.customerEmail}</p>
              <p className="text-stone-600">{order.customerPhone}</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider block">Shipping Address</span>
              <p className="font-bold text-stone-900">{order.address}</p>
              <p className="text-stone-600">
                {order.city} {order.postalCode ? `, ${order.postalCode}` : ''}
              </p>
              <p className="text-stone-600">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</p>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#173627]">{item.productName}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Size: {item.size} • Color: {item.colorName} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">
                  {settings.currencySymbol || '$'}{item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">
                {settings.currencySymbol || '$'}{order.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-stone-900">
                {order.shipping === 0 ? 'FREE' : `${settings.currencySymbol || '$'}${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-[#173627] pt-2 border-t border-stone-200">
              <span>Total Paid / Due on Delivery</span>
              <span>{settings.currencySymbol || '$'}{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onContinueShopping}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </button>
        <button
          onClick={() => onTrackOrder(orderNumber)}
          className="flex-1 py-3.5 px-6 rounded-2xl border border-stone-300 font-bold text-xs uppercase tracking-wider text-stone-800 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          Track Order Live
        </button>
      </div>
    </div>
  );
};
