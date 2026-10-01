import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  Star,
  Layers,
  Palette,
  Upload,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface HomePageProps {
  onNavigateShop: (categorySlug?: string) => void;
  onNavigateProduct: (product: Product) => void;
  onNavigateCustomStudio: () => void;
  onNavigateTracking: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateShop,
  onNavigateProduct,
  onNavigateCustomStudio,
  onNavigateTracking,
}) => {
  const { products, categories, settings } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const faqs = [
    {
      q: 'What makes your T-shirts "heavyweight" compared to regular brands?',
      a: 'Standard commercial t-shirts are typically 140 to 180 GSM and feel flimsy after a few washes. Verdant Threads shirts are crafted from dense 240 to 280 GSM combed organic ring-spun cotton. They hold a clean structured boxy drape, do not cling, and maintain their shape for years.',
    },
    {
      q: 'Will the screen print crack or fade in the wash?',
      a: 'No. We use industrial water-based discharge and archival plastisol inks cured in a tunnel dryer at 320°F. The pigments fuse directly into the cotton fibers rather than sitting on top like cheap heat transfers. Simply wash cold inside-out.',
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'Select "Cash on Delivery" at checkout. We prepare and print your shirt, dispatch with our courier partners, and you simply pay cash or card upon arrival at your doorstep. Zero upfront risk.',
    },
    {
      q: 'Can I print my own custom artwork on your shirts?',
      a: 'Yes! Visit our Custom Studio page where you can upload your graphics, select your blank garment weight and color, choose front/back placement, and order single units or bulk batches.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-800/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Seasonal Drop 03 • 240-280 GSM Editions
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black font-heading tracking-tight text-[#173627] leading-[1.02]">
                {settings.heroHeading || 'WEAR YOUR CREATIVITY'}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                {settings.heroDescription ||
                  'Heavyweight 240+ GSM combed organic cotton meets archival Japanese screen prints and tactile 3D puff designs. Built for silhouettes that command attention.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateShop()}
                  className="py-4 px-8 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop All T-Shirts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onNavigateCustomStudio}
                  className="py-4 px-7 rounded-2xl bg-white hover:bg-stone-50 text-[#173627] font-bold text-xs uppercase tracking-wider border border-stone-300 shadow-sm transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-emerald-800" />
                  Custom Print Studio
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/90 text-xs">
                <div>
                  <span className="font-heading font-black text-lg sm:text-xl text-[#173627] block">240+ GSM</span>
                  <span className="text-stone-500 font-medium text-[11px]">Ultra-heavy combed cotton</span>
                </div>
                <div>
                  <span className="font-heading font-black text-lg sm:text-xl text-[#173627] block">100% Eco-Inks</span>
                  <span className="text-stone-500 font-medium text-[11px]">Archival Swiss pigments</span>
                </div>
                <div>
                  <span className="font-heading font-black text-lg sm:text-xl text-[#173627] block">48h Dispatch</span>
                  <span className="text-stone-500 font-medium text-[11px]">Doorstep COD & Express</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-100 group">
                <img
                  src={settings.heroImage || '/images/hero_tshirt_banner_1790863003479.jpg'}
                  alt="Verdant Threads Heavyweight Custom Printed Streetwear"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                {/* Floating Card On Hero */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#173627] text-white flex items-center justify-center font-heading font-black">
                      V
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                        Featured Edition
                      </span>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-stone-900">
                        Botanical Blueprint Tee
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const forestTee = products.find((p) => p.id === 'prod-forest-botanical') || products[0];
                      if (forestTee) onNavigateProduct(forestTee);
                    }}
                    className="p-2 rounded-xl bg-[#173627] text-white hover:bg-[#11291E] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
              Curated Silhouettes
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-[#173627] mt-1">
              Explore Collections
            </h2>
          </div>
          <button
            onClick={() => onNavigateShop()}
            className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline underline-offset-4"
          >
            Browse All Cuts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => onNavigateShop(cat.slug)}
              className="group cursor-pointer relative aspect-4/5 rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                  {cat.productCount || 4} Designs Available
                </span>
                <h3 className="font-heading font-black text-base sm:text-lg mt-0.5 group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-300 mt-1 line-clamp-1 opacity-90">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
              The Essentials
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-[#173627] mt-1">
              Featured Heavyweight Drops
            </h2>
          </div>
          <button
            onClick={() => onNavigateShop()}
            className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline underline-offset-4"
          >
            View Complete Vault <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onNavigateProduct} />
          ))}
        </div>
      </section>

      {/* 4. CUSTOM PRINTING STUDIO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#173627] text-white p-8 sm:p-14 shadow-2xl border border-emerald-900 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Print-on-Demand Studio
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight">
              Got Artwork? We Print Your Custom Vision.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Upload your illustrations, typography, or clothing line logos. Select your preferred GSM fabric weight, choose chest or full-back placement, and preview live on our 3D mockup generator.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onNavigateCustomStudio}
                className="py-3.5 px-8 rounded-2xl bg-[#D4AF37] hover:bg-[#C2A24D] text-stone-900 font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Launch Custom Workshop
              </button>
              <div className="text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                No minimum order quantity required
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 p-5 space-y-3 z-10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-stone-400 pb-3 border-b border-white/10">
              <span>Studio Workshop Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active Printing
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Fabric Blank</span>
                <span className="font-bold text-white">280 GSM Luxury Boxy</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Color</span>
                <span className="font-bold text-white">Forest Emerald / Washed Black</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Technique</span>
                <span className="font-bold text-white">Swiss Eco Screen / 3D Puff</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
              Fresh Off the Dryer
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-[#173627] mt-1">
              New Season Releases
            </h2>
          </div>
          <button
            onClick={() => onNavigateShop()}
            className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline underline-offset-4"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onNavigateProduct} />
          ))}
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP & COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-stone-200 shadow-md">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
              Fabric Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-[#173627] mt-1">
              Why 240+ GSM Matters
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              We engineered our blanks from the ground up to solve the three major flaws of modern retail t-shirts: bacon collars, cheap transparency, and print peeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-[#173627] text-white flex items-center justify-center font-bold text-sm">
                01
              </span>
              <h3 className="font-heading font-black text-base text-[#173627]">Industrial 1.25&quot; Ribbed Collar</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Spun with 5% elastane reinforcement so the neckline never stretches out or bobs after repeated machine washings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-[#173627] text-white flex items-center justify-center font-bold text-sm">
                02
              </span>
              <h3 className="font-heading font-black text-base text-[#173627]">True Streetwear Drop Shoulder</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A modern architectural cut that drapes cleanly over the shoulder without puffing or restricting arm movement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-[#173627] text-white flex items-center justify-center font-bold text-sm">
                03
              </span>
              <h3 className="font-heading font-black text-base text-[#173627]">Pre-Shrunk Silicone Washed</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every batch is washed with organic silicone enzymes before cutting, ensuring absolute softness and zero shrinkage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-[#173627]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-stone-200 shadow-2xs overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-heading font-bold text-sm text-[#173627] hover:bg-stone-50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="p-1 rounded-md bg-stone-100 text-stone-600">
                  {openFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
