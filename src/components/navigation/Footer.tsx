import React, { useState } from 'react';
import { Mail, ArrowRight, Shield, Award, Sparkles, CheckCircle, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to HA Clothing VIP list! Rs. 500 off voucher sent to your inbox.', 'success');
    setNewsletterEmail('');
  };

  const whatsappClean = (settings.whatsappNumber || '03101284712').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#0E2218] text-[#FAF7F2] border-t border-emerald-950/80 pt-16 pb-12">
      {/* Brand Guarantees Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-emerald-900/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <div className="p-3 rounded-xl bg-emerald-900/50 text-[#D4AF37]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white">240-280 GSM Heavyweight</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                100% combed ring-spun organic cotton with reinforced collar ribbing that never loses shape or bacons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <div className="p-3 rounded-xl bg-emerald-900/50 text-[#D4AF37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white">Archival Japanese Inks</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Precision screen, water-based discharge, and 3D puff prints engineered for 100+ wash cycles.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <div className="p-3 rounded-xl bg-emerald-900/50 text-[#D4AF37]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white">Cash on Delivery Across Pakistan</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Inspect your parcel and pay upon doorstep arrival anywhere in Pakistan. 14-day hassle-free size exchange.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="lg" textColor="text-white" />
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {settings.tagline ||
                'HA Clothing — Premium custom printed heavyweight streetwear in Pakistan. Designed for enduring structure, expressive art, and athletic silhouette.'}
            </p>

            {/* Admin-Controlled Customer Contact Information */}
            <div className="pt-2 text-xs text-stone-300 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{settings.businessAddress || settings.address || 'Hammad and Ayaan Studio, Lahore, Pakistan'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Phone: {settings.businessPhone || settings.contactPhone || '0310 1284712'}</span>
              </p>
              {settings.whatsappNumber && (
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${whatsappClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    WhatsApp: {settings.whatsappNumber}
                  </a>
                </p>
              )}
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Email: {settings.businessEmail || settings.contactEmail || 'support@haclothing.com'}</span>
              </p>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] font-heading">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Shop All T-Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('oversized')} className="hover:text-white transition-colors">
                  Oversized Cuts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('graphic')} className="hover:text-white transition-colors">
                  Graphic & Typography
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-print')} className="hover:text-white transition-colors">
                  Custom Studio & Bulk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Fresh Drops
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] font-heading">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About HA Clothing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] font-heading">
              Drop Access & Insider Restocks
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe to get notified for limited seasonal streetwear drops and receive Rs. 500 off your first order.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-900/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are subscribed! Welcome to HA Clothing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-stone-400 focus:outline-hidden focus:border-[#D4AF37] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 bg-[#D4AF37] hover:bg-[#C2A24D] text-stone-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName || 'HA Clothing'}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-stone-300 font-medium">
            <span>Cash on Delivery (COD)</span>
            <span>•</span>
            <span>JazzCash / EasyPaisa / Bank Transfer</span>
            <span>•</span>
            <span>TCS & Leopard Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
