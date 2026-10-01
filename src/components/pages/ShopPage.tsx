import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface ShopPageProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onNavigateCustomStudio: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  onSelectProduct,
  onNavigateCustomStudio,
}) => {
  const { products, categories, settings } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [showOnlySale, setShowOnlySale] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'all') {
        const catObj = categories.find((c) => c.slug === selectedCategory);
        const matchName = catObj ? catObj.name : selectedCategory;
        if (p.category.toLowerCase() !== matchName.toLowerCase()) return false;
      }

      // Size filter
      if (selectedSize !== 'all') {
        if (!p.sizes.includes(selectedSize)) return false;
      }

      // Sale filter
      if (showOnlySale && !p.salePrice) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, categories, selectedCategory, selectedSize, showOnlySale, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSearchQuery('');
    setShowOnlySale(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200 gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
            Catalog & Editions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#173627] mt-1">
            All Custom Printed Tees
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl">
            Engineered from heavy combed organic cotton with archival Japanese screen inks, tactile puff details, and relaxed boxy silhouettes.
          </p>
        </div>

        {/* Custom Studio Banner Link */}
        <div
          onClick={onNavigateCustomStudio}
          className="p-4 rounded-2xl bg-emerald-950 text-white cursor-pointer hover:bg-emerald-900 transition-all border border-emerald-800 shadow-md flex items-center justify-between gap-4 max-w-sm"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
              Want your own graphic?
            </span>
            <span className="text-xs font-bold font-heading">Launch Custom Print Workshop →</span>
          </div>
          <span className="p-2 rounded-xl bg-emerald-800/80 text-white text-xs font-bold">
            Studio
          </span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="mt-8 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#173627] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#173627] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => setShowOnlySale(!showOnlySale)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              showOnlySale
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            Sale Items
          </button>
        </div>

        {/* Second bar: Search, Sizes, Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prints, fits, GSM..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:outline-hidden focus:border-[#173627]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Size filter */}
            <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-2 py-1">
              <span className="text-[11px] font-bold text-stone-400 px-1 uppercase">Size:</span>
              {['all', 'S', 'M', 'L', 'XL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                    selectedSize === sz
                      ? 'bg-[#173627] text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="pl-3 pr-8 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-[#173627] focus:outline-hidden focus:border-[#173627] cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory !== 'all' || selectedSize !== 'all' || showOnlySale || searchQuery) && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-400 font-semibold">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
              {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}
          {selectedSize !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
              Size {selectedSize}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize('all')} />
            </span>
          )}
          {showOnlySale && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">
              On Sale
              <X className="w-3 h-3 cursor-pointer" onClick={() => setShowOnlySale(false)} />
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 text-xs font-bold">
              &ldquo;{searchQuery}&rdquo;
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="mt-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-xs p-8 space-y-4">
            <Tag className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-heading font-black text-xl text-[#173627]">No Custom Tees Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or search term.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#173627] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#11291E] transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
