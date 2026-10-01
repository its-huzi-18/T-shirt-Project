import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StyleInspirationSectionProps {
  onNavigateShop: () => void;
}

export const StyleInspirationSection: React.FC<StyleInspirationSectionProps> = ({ onNavigateShop }) => {
  const { settings } = useStore();

  const title = settings.styleInspirationTitle || 'Style Inspiration';
  const subtitle =
    settings.styleInspirationSubtitle ||
    'Athletic Dominance Meets Contemporary Street Silhouette';

  const inspirations = [
    {
      id: 'babar-azam',
      name: settings.styleInspirationAthlete1Name || 'Babar Azam',
      role: settings.styleInspirationAthlete1Role || 'Modern Sporting Icon & Trendsetter',
      image: settings.styleInspirationAthlete1Image || '/images/babar_azam.jpg',
      styleTag: 'Oversized Boxy Cut • 260 GSM Heavyweight',
      palette: 'Forest Emerald & Obsidian',
      quote: 'Engineered for athletes and visionaries who command structure and uncompromising poise on and off the pitch.',
    },
    {
      id: 'virat-kohli',
      name: settings.styleInspirationAthlete2Name || 'Virat Kohli',
      role: settings.styleInspirationAthlete2Role || 'Global Sporting Phenomenon & Athleisure Influence',
      image: settings.styleInspirationAthlete2Image || '/images/virat_kohli.jpg',
      styleTag: 'Drop-Shoulder Streetwear • Archival Inks',
      palette: 'Washed Black & Minimalist Sand',
      quote: 'Clean lines, supreme fabric weight, and timeless athletic presence crafted to withstand hundreds of wears.',
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0E2218] text-[#FAF7F2] border-y border-emerald-950/80">
      {/* Background subtle atmospheric gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-900/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173627] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Featured Inspiration</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto"
          >
            {subtitle}. Heavyweight organic fabrics designed to mirror the presence, intensity, and effortless cool of the subcontinent&apos;s sporting legends.
          </motion.p>
        </div>

        {/* 2-Column Athlete / Influencer Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {inspirations.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.2 }}
              className="group relative rounded-3xl overflow-hidden border border-emerald-900/60 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl backdrop-blur-xs flex flex-col"
            >
              {/* Image Frame with Subtle Parallax Zoom */}
              <div className="relative aspect-3/4 sm:aspect-4/5 overflow-hidden bg-stone-900">
                <img
                  src={item.image}
                  alt={`${item.name} Style Inspiration`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105 filter contrast-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2218] via-[#0E2218]/30 to-transparent" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Award className="w-3 h-3 text-[#D4AF37]" />
                    {item.styleTag}
                  </span>
                </div>

                {/* Inset Athlete Name Banner */}
                <div className="absolute bottom-4 inset-x-4 p-5 rounded-2xl bg-[#0E2218]/85 backdrop-blur-md border border-emerald-900/80 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                        {item.role}
                      </p>
                    </div>
                    <span className="w-9 h-9 rounded-xl bg-[#173627] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-heading font-black text-sm">
                      HA
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 italic leading-relaxed pt-1 border-t border-emerald-900/60">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">
                      Palette: {item.palette}
                    </span>
                    <button
                      onClick={onNavigateShop}
                      className="text-xs font-bold text-[#D4AF37] hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
                    >
                      Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer / Editorial Note */}
        <div className="mt-12 pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between text-stone-400 text-xs gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Style Reference & Editorial Inspiration • Pure Cotton Silhouettes</span>
          </div>
          <button
            onClick={onNavigateShop}
            className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            Shop the Complete Pakistan Drop →
          </button>
        </div>
      </div>
    </section>
  );
};
