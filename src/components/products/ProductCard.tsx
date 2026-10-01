import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist, settings } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', code: '#000' });
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  const inWish = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(product)}
      className="group cursor-pointer rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-[#F3EFE6]">
        {/* Main Image */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.thumbnail || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="product-card-img w-full h-full object-cover transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-[#173627] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !discountPercent && (
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-stone-900 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              New Drop
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            inWish
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 text-stone-600 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 px-3 bg-[#173627]/95 hover:bg-[#0E2218] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 backdrop-blur-xs shadow-md transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add ({selectedSize})
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2.5 bg-white/95 hover:bg-white text-stone-800 rounded-xl shadow-md backdrop-blur-xs transition-all"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* GSM tag badge */}
        {product.fabricGSM && (
          <div className="absolute bottom-3 left-3 sm:group-hover:opacity-0 transition-opacity">
            <span className="px-2 py-0.5 rounded-md bg-stone-900/60 backdrop-blur-xs text-[10px] font-bold text-white tracking-widest uppercase">
              {product.fabricGSM} GSM
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-emerald-800">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-sm sm:text-base text-[#173627] line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-1 font-normal">
            {product.shortDescription || product.fit || 'Heavyweight oversized cut'}
          </p>
        </div>

        {/* Color swatches & sizes */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          {/* Colors */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                title={c.name}
                className={`w-3.5 h-3.5 rounded-full transition-all border ${
                  selectedColor.name === c.name
                    ? 'ring-2 ring-[#173627] ring-offset-1 scale-115 border-transparent'
                    : 'border-stone-300 hover:scale-110'
                }`}
                style={{ backgroundColor: c.code }}
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            {product.salePrice ? (
              <>
                <span className="text-base sm:text-lg font-black text-[#173627]">
                  {settings.currencySymbol || '$'}{product.salePrice.toFixed(2)}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  {settings.currencySymbol || '$'}{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-black text-[#173627]">
                {settings.currencySymbol || '$'}{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile quick add button */}
        <div className="mt-3 pt-2 block sm:hidden">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-[#173627] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
};
