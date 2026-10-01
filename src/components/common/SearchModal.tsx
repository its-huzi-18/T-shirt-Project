import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { products, settings } = useStore();
  const [queryText, setQueryText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQueryText('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }, [queryText, products]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[80vh]"
        >
          {/* Search Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-white">
            <Search className="w-5 h-5 text-emerald-800 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search heavyweight tees, puff print, botanical, oversized..."
              className="w-full text-base sm:text-lg bg-transparent text-[#173627] placeholder:text-stone-400 focus:outline-hidden font-medium"
            />
            {queryText && (
              <button
                onClick={() => setQueryText('')}
                className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 bg-stone-100 rounded-md"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions if empty */}
          {!queryText && (
            <div className="p-6">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Oversized Tee', 'Botanical Print', 'Vintage Acid Wash', 'Tactile Puff Print', 'Forest Emerald', '280 GSM'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQueryText(tag)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200/70 hover:bg-[#173627] hover:text-white transition-all text-xs font-medium text-stone-700"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results List */}
          {queryText && (
            <div className="overflow-y-auto p-4 divide-y divide-stone-100 flex-1">
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-stone-500 text-sm">No products found matching &ldquo;{queryText}&rdquo;</p>
                  <p className="text-xs text-stone-400 mt-1">Try searching for &quot;Oversized&quot;, &quot;Puff&quot;, or &quot;Vintage&quot;</p>
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="py-3 px-2 flex items-center justify-between rounded-xl hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {product.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#173627] mt-1 group-hover:text-emerald-700 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-stone-900">
                            {settings.currencySymbol || '$'}
                            {(product.salePrice ?? product.price).toFixed(2)}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-stone-400 line-through">
                              {settings.currencySymbol || '$'}
                              {product.price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-xs text-stone-500">• {product.stock} in stock</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[#173627] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
