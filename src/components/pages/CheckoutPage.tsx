import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatPKR } from '../../lib/formatters';

interface CheckoutPageProps {
  onOrderSuccess: (orderId: string, orderNumber: string) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onBackToCart }) => {
  const { cart, cartSubtotal, shippingFee, isFreeShipping, cartTotal, settings, createOrder, showToast } = useStore();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: 'Lahore',
    area: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mock card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const pakistanCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Quetta',
    'Abbottabad',
    'Bahawalpur',
    'Sargodha',
    'Sukkur',
    'Other City',
  ];

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-200/80 flex items-center justify-center mx-auto text-stone-500 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-heading text-[#173627]">Your Shopping Bag is Empty</h2>
        <p className="text-stone-500 text-xs mt-2 max-w-sm mx-auto">
          Please add some custom printed tees before proceeding to checkout.
        </p>
        <button
          onClick={onBackToCart}
          className="mt-6 px-6 py-3 bg-[#173627] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#11291E] transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMessage('Please enter a valid phone number (e.g. 0310 1284712)');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address for your order receipt');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your delivery street address');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city');
      return;
    }

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvc) {
        setErrorMessage('Please provide complete card payment details');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { orderId, orderNumber } = await createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        postalCode: formData.postalCode,
        paymentMethod,
        customerNotes: formData.notes,
        customerId: currentUser?.uid || null,
      });

      onOrderSuccess(orderId, orderNumber);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="pb-8 border-b border-stone-200">
        <h1 className="text-3xl font-black font-heading text-[#173627]">Secure Checkout</h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your delivery details for Cash on Delivery across Pakistan.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        {/* Left: Customer & Delivery Details Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold font-heading text-[#173627] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Muhammad Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number (for Courier Call / WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0310 1284712"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (for Order Confirmation & Tracking) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold font-heading text-[#173627] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Delivery Address in Pakistan
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    House / Street Address, Sector, Flat No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House 42, Street 8, Phase 5, DHA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627] bg-white font-semibold"
                    >
                      {pakistanCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Area / Tehsil
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Gulberg / Clifton"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="54000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Deliver between 2 PM to 6 PM, call before arriving..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#173627]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold font-heading text-[#173627] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#173627] bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-5 h-5 text-emerald-800" />
                      <span className="font-bold text-xs sm:text-sm text-stone-900">Cash on Delivery (COD)</span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                    Pay securely in cash when the courier arrives at your doorstep anywhere in Pakistan. Recommended.
                  </p>
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#173627] bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-emerald-800" />
                      <span className="font-bold text-xs sm:text-sm text-stone-900">Card / Digital Pay</span>
                    </div>
                    {paymentMethod === 'card' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                    256-bit encrypted checkout. Supports Visa, Mastercard, and UnionPay.
                  </p>
                </div>
              </div>

              {/* Card Inputs if selected */}
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">MM / YY</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              {isSubmitting
                ? 'Processing Your Order...'
                : `Place Order • ${formatPKR(cartTotal, settings.currencySymbol || 'Rs.')}`}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sticky Card */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-heading font-black text-base text-[#173627]">Order Summary</h3>
              <span className="text-xs font-bold text-stone-500">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>

            {/* Items list */}
            <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-3">
              {cart.map((item) => (
                <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#173627] truncate">{item.name}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {item.size} • {item.color.name} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900 shrink-0">
                    {formatPKR(item.price * item.quantity, settings.currencySymbol || 'Rs.')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial lines in PKR */}
            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">
                  {formatPKR(cartSubtotal, settings.currencySymbol || 'Rs.')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-800">
                  {isFreeShipping ? 'FREE' : formatPKR(shippingFee, settings.currencySymbol || 'Rs.')}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#173627] pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-[#173627]">{formatPKR(cartTotal, settings.currencySymbol || 'Rs.')}</span>
              </div>
            </div>

            {/* Assurance */}
            <div className="p-3 bg-stone-50 rounded-xl text-stone-500 text-[11px] space-y-1.5 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <Truck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Estimated courier delivery in {settings.deliveryDays || '2 - 4 business days'}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Cash on delivery with parcel inspection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
