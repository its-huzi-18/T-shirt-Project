import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Ruler,
  Check,
  ChevronRight,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Product, ProductReview } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { SizeGuideModal } from '../common/SizeGuideModal';

interface ProductDetailsPageProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onNavigateToCheckout: () => void;
  onBackToShop: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onSelectProduct,
  onNavigateToCheckout,
  onBackToShop,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, products, settings, addReview, getProductReviews } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || { name: 'Default', code: '#000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  // Write Review State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0] || { name: 'Default', code: '#000' });
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch reviews
    getProductReviews(product.id).then(setReviews);
  }, [product.id, getProductReviews]);

  const discountPercent =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  const inWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onNavigateToCheckout();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      await addReview(product.id, reviewName, reviewRating, reviewComment);
      const updated = await getProductReviews(product.id);
      setReviews(updated);
      setReviewName('');
      setReviewComment('');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6">
        <button onClick={onBackToShop} className="hover:text-[#173627] transition-colors">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-emerald-800">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Photo */}
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images[activeImageIndex] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {discountPercent && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                  Save {discountPercent}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-3 py-1 rounded-full bg-[#173627] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Best Seller
                </span>
              )}
            </div>

            {/* Fabric GSM Tag */}
            {product.fabricGSM && (
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">
                {product.fabricGSM} GSM Combed Cotton
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#173627] shadow-md scale-102 ring-2 ring-emerald-900/20'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Actions */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-bold text-stone-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#173627] mt-3 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-600 font-medium">
                {product.reviewsCount + reviews.length} verified customer reviews
              </span>
              <span className="text-stone-300">•</span>
              <span
                className={`text-xs font-bold ${
                  product.stock > 10 ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Price block */}
            <div className="mt-4 flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-black text-[#173627]">
                    {settings.currencySymbol || '$'}{product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-stone-400 line-through font-semibold">
                    {settings.currencySymbol || '$'}{product.price.toFixed(2)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-bold">
                    Save {settings.currencySymbol || '$'}{(product.price - product.salePrice).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-[#173627]">
                  {settings.currencySymbol || '$'}{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-stone-200" />

          {/* Color Selection */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Selected Color: <span className="text-[#173627] font-black">{selectedColor.name}</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedColor.name === c.name
                      ? 'border-[#173627] bg-[#173627] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-800 hover:border-stone-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                    style={{ backgroundColor: c.code }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Selected Size: <span className="text-[#173627] font-black">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline underline-offset-2"
              >
                <Ruler className="w-3.5 h-3.5" />
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedSize === s
                      ? 'bg-[#173627] text-white border-[#173627] shadow-xs'
                      : 'bg-white border-stone-300 text-stone-800 hover:border-stone-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-2xl bg-white px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-10 flex items-center justify-center text-stone-600 font-bold hover:text-stone-900"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-stone-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-10 flex items-center justify-center text-stone-600 font-bold hover:text-stone-900"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Shopping Bag
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  inWish
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-stone-300 bg-white text-stone-600 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C2A24D] text-stone-900 font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Instant Checkout / Cash on Delivery
            </button>
          </div>

          {/* Perks Guarantee list */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2.5 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Free shipping on orders over {settings.currencySymbol || '$'}
                {settings.freeShippingThreshold || 75}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>14-day hassle-free size exchange guarantee</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Certified 240+ GSM Combed Organic Cotton & Eco Inks</span>
            </div>
          </div>

          {/* Description & Specifications */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#173627] uppercase tracking-wider">
                Craftsmanship & Fabric Specifications
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-100 rounded-xl">
                <span className="text-stone-400 block font-semibold">Fabric Weight</span>
                <span className="font-bold text-stone-800">{product.fabricGSM || 260} GSM Luxury Jersey</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl">
                <span className="text-stone-400 block font-semibold">Print Technique</span>
                <span className="font-bold text-stone-800">{product.printType || 'Archival Screen Print'}</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl">
                <span className="text-stone-400 block font-semibold">Silhouette / Fit</span>
                <span className="font-bold text-stone-800">{product.fit || 'Boxy Drop-Shoulder'}</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl">
                <span className="text-stone-400 block font-semibold">Wash Instructions</span>
                <span className="font-bold text-stone-800">Cold Wash Inside-Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-12 border-t border-stone-200">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-800">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-2xl font-black font-heading text-[#173627]">Customer Reviews</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real feedback from customers who wear this print daily.
          </p>

          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="mt-6 p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-heading font-bold text-sm text-[#173627]">Write a Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Jordan K."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#173627]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#173627] bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars - Great Quality</option>
                  <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                  <option value={2}>⭐⭐ 2 Stars - Below Expectations</option>
                  <option value={1}>⭐ 1 Star - Unsatisfied</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How does the fabric feel? How is the print holding up?"
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#173627]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="py-2.5 px-6 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              {isSubmittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>

          {/* Reviews list */}
          <div className="mt-8 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-100/60 rounded-2xl">
                Be the first to write a review for this print!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#173627]">{rev.customerName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black font-heading text-[#173627]">You May Also Like</h2>
              <p className="text-xs text-stone-500 mt-1">Curated pairings from the same drop.</p>
            </div>
            <button
              onClick={onBackToShop}
              className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 underline"
            >
              View Full Drop
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};
