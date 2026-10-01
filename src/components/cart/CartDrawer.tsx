import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout, onNavigateToCart }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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
  const progressPercent = Math.min(100, (cartSubtotal / threshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-stone-200"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#173627]" />
                  <h2 className="text-lg font-black font-heading text-[#173627]">
                    Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress */}
              <div className="p-4 bg-emerald-950 text-white text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  {isFreeShipping ? (
                    <span className="text-emerald-300 font-bold">🎉 Congratulations! You have unlocked Free Shipping!</span>
                  ) : (
                    <span>
                      Add <strong className="text-emerald-300">{settings.currencySymbol || '$'}{remainingForFreeShipping.toFixed(2)}</strong> more for FREE Shipping!
                    </span>
                  )}
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-400">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-bold text-[#173627]">Your bag is empty</h4>
                      <p className="text-xs text-stone-500 mt-1 max-w-xs">
                        Explore our heavyweight custom prints and find your signature statement piece.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 bg-[#173627] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#11291E] transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs flex gap-3.5 relative group"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start pr-6">
                            <h4 className="text-sm font-bold text-[#173627] truncate">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-stone-700">
                              Size: {item.size}
                            </span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-stone-700">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                                style={{ backgroundColor: item.color.code }}
                              />
                              {item.color.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                          {/* Quantity control */}
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, -1)}
                              className="p-1 hover:bg-stone-200 text-stone-600 rounded-l-lg transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-stone-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-1 hover:bg-stone-200 text-stone-600 rounded-r-lg transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-sm font-black text-[#173627]">
                              {settings.currencySymbol || '$'}{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="absolute top-2.5 right-2.5 p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cart.length > 0 && (
                <div className="p-5 bg-white border-t border-stone-200 space-y-3">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-stone-900">
                        {settings.currencySymbol || '$'}{cartSubtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-bold text-stone-900">
                        {isFreeShipping ? 'FREE' : `${settings.currencySymbol || '$'}${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-black text-[#173627] pt-2 border-t border-stone-100">
                      <span>Total</span>
                      <span>{settings.currencySymbol || '$'}{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigateToCart();
                      }}
                      className="py-3 px-3 rounded-xl border border-stone-300 font-bold text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 transition-all text-center"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigateToCheckout();
                      }}
                      className="py-3 px-3 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      Checkout
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
