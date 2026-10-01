import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartPageProps {
  onNavigateToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    shippingFee,
    isFreeShipping,
    cartTotal,
    settings,
  } = useStore();

  const threshold = settings.freeShippingThreshold || 75;
  const remainingForFreeShipping = Math.max(0, threshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-stone-200/80 flex items-center justify-center mx-auto text-stone-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black font-heading text-[#173627]">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Explore our artisan screen printed collections and discover heavy cotton pieces crafted to endure.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-4 px-8 py-3.5 bg-[#173627] text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#11291E] transition-all"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onContinueShopping}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#173627] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </button>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#173627]">
            Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h1>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-white text-xs flex items-center gap-3">
            <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              {isFreeShipping ? (
                <span className="font-bold text-emerald-300">You qualify for FREE worldwide shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-emerald-300">{settings.currencySymbol || '$'}{remainingForFreeShipping.toFixed(2)}</strong> more to get Free Express Shipping!
                </span>
              )}
            </div>
          </div>

          <div className="divide-y divide-stone-200 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            {cart.map((item) => (
              <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-[#173627]">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-600">
                      <span className="font-semibold">Size: {item.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.color.code }}
                        />
                        {item.color.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-stone-900 mt-2 block sm:hidden">
                      {settings.currencySymbol || '$'}{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-base font-black text-[#173627] hidden sm:block">
                    {settings.currencySymbol || '$'}{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-6">
            <h3 className="font-heading font-black text-lg text-[#173627]">Order Summary</h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">
                  {settings.currencySymbol || '$'}{cartSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-stone-900">
                  {isFreeShipping ? 'FREE' : `${settings.currencySymbol || '$'}${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black text-[#173627] pt-3 border-t border-stone-200">
                <span>Total</span>
                <span>{settings.currencySymbol || '$'}{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToCheckout}
              className="w-full py-4 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-4 bg-stone-50 rounded-2xl text-[11px] text-stone-500 space-y-2 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Cash on delivery available at checkout</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <Truck className="w-4 h-4 text-emerald-800" />
                <span>Dispatches from studio within 48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
