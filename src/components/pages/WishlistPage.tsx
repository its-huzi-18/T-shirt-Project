import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface WishlistPageProps {
  onSelectProduct: (p: Product) => void;
  onNavigateShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, onNavigateShop }) => {
  const { wishlist, products } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Curated Favorites
          </span>
          <h1 className="text-3xl font-black font-heading text-[#173627] mt-1">
            Your Wishlist ({wishlistedProducts.length})
          </h1>
        </div>
        {wishlistedProducts.length > 0 && (
          <button
            onClick={onNavigateShop}
            className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 underline"
          >
            Explore More Tees
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-xs p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-xl text-[#173627]">Your Wishlist is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Save designs you admire by tapping the heart icon on any product card or detail page.
          </p>
          <button
            onClick={onNavigateShop}
            className="px-6 py-3 bg-[#173627] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#11291E] transition-all"
          >
            Discover Drops
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
};
