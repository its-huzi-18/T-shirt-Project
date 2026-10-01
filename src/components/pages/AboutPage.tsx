import React from 'react';
import { Award, Leaf, Sparkles, Shield, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AboutPageProps {
  onNavigateShop: () => void;
  onNavigateCustomStudio: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateShop, onNavigateCustomStudio }) => {
  const { settings } = useStore();

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
          Craft & Origin
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-[#173627] max-w-3xl mx-auto leading-tight">
          Heavyweight Cotton. Archival Inks. Zero Fast-Fashion Fluff.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Founded with a relentless dedication to heavyweight fabric structure, handcrafted screen printing, and enduring silhouette architecture.
        </p>
      </section>

      {/* Story & Image Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl aspect-16/9 sm:aspect-21/9 bg-[#0E2218]">
          <img
            src="/images/hero_tshirt_banner_1790863003479.jpg"
            alt="Verdant Threads Studio Atelier"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8 sm:p-12">
            <div className="text-white max-w-xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                Studio Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading">
                We Build T-Shirts To Outlast Trends
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Most apparel companies treat tees as disposable promo collateral. At Verdant Threads, we engineer each shirt from 240+ GSM organic cotton, hand-pull every screen print with Swiss eco-inks, and cure each piece for lifelong wash resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#173627]">Heavyweight Structure</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We exclusively use 240 to 280 GSM combed ring-spun organic cotton. It hangs with deliberate drape, avoids clinginess, and features a thick 1.25&quot; neckband that never loses tension.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#173627]">Master Print Techniques</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              From breathable water-based discharge to 3D tactile puff printing and archival multi-color screen pulls, our workshop uses chemical-safe, certified Oeko-Tex inks.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#173627]">Ethical & Pre-Shrunk</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero forced labor, 100% fair wages. Every batch undergoes an industrial enzyme bath so your shirt maintains the exact cut and size you ordered from day one to year five.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#173627] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-heading">
              Ready to Upgrade Your Heavyweight Rotation?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              Explore our current seasonal drops or collaborate with our screen printing studio for your own custom merchandise.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onNavigateShop}
              className="py-3.5 px-8 rounded-2xl bg-[#D4AF37] hover:bg-[#C2A24D] text-stone-900 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Shop All T-Shirts
            </button>
            <button
              onClick={onNavigateCustomStudio}
              className="py-3.5 px-8 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
            >
              Launch Custom Print Studio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
