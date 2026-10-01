import React, { useState } from 'react';
import {
  Save,
  Sparkles,
  Globe,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Truck,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

interface AdminSettingsProps {
  initialSection?: 'customization' | 'settings';
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ initialSection = 'customization' }) => {
  const { updateSettings } = useAdmin();
  const { settings, showToast } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'customization' | 'contact' | 'shipping' | 'inspiration'>(
    initialSection === 'settings' ? 'shipping' : 'customization'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showToast('All settings and customizations saved to Firebase!', 'success');
    } catch {
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-[#173627]">
            Website Customization & Store Settings
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time control over brand identity, customer contact details, shipping in PKR, and style inspiration.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="py-3 px-6 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Syncing to Database...' : 'Save All Settings'}
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-bold">
        {[
          { id: 'customization', label: 'Brand & Hero' },
          { id: 'contact', label: 'Contact & WhatsApp' },
          { id: 'shipping', label: 'Shipping & Currency (PKR)' },
          { id: 'inspiration', label: 'Style Inspiration (Athletes)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`py-2 px-4 rounded-xl whitespace-nowrap uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-[#173627] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. BRAND & HERO CUSTOMIZATION */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            {/* Identity */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-800" />
                Brand Identity & Logo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Logo URL (Medallion)</label>
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="/images/ha_clothing_logo.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Favicon URL</label>
                  <input
                    type="text"
                    value={formData.faviconUrl || ''}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="/images/ha_clothing_logo.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                Storefront Hero Presentation
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    required
                    value={formData.heroHeading}
                    onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold font-heading bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hero Subheading</label>
                  <textarea
                    rows={3}
                    value={formData.heroDescription}
                    onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs leading-relaxed bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hero Image URL</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Ticker */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-heading font-black text-sm text-[#173627]">Top Announcement Ticker</h3>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={formData.promoBanner}
                  onChange={(e) => setFormData({ ...formData, promoBanner: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.showPromoBanner}
                  onChange={(e) => setFormData({ ...formData, showPromoBanner: e.target.checked })}
                  className="accent-[#173627] rounded-sm"
                />
                Show Announcement Banner at Top of Website
              </label>
            </div>
          </div>
        )}

        {/* 2. CONTACT INFORMATION & WHATSAPP */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="pb-3 border-b border-stone-100">
                <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-800" />
                  Admin-Controlled Customer Contact Information
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Updates immediately across the Contact page, Footer, Navbar, Order Confirmations, and Support cards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    value={formData.businessEmail || formData.contactEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessEmail: e.target.value,
                        contactEmail: e.target.value,
                      })
                    }
                    placeholder="support@haclothing.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Business Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.businessPhone || formData.contactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessPhone: e.target.value,
                        contactPhone: e.target.value,
                      })
                    }
                    placeholder="0310 1284712"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Support Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+92 310 1284712"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Customer Order Support Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail || ''}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    placeholder="orders@haclothing.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Physical Business Address</label>
                  <input
                    type="text"
                    value={formData.businessAddress || formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessAddress: e.target.value,
                        address: e.target.value,
                      })
                    }
                    placeholder="Hammad and Ayaan Studio, Fashion Ave, Lahore, Pakistan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-800" />
                Social Media Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.instagramUrl || ''}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/haclothing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={formData.facebookUrl || ''}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/haclothing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">TikTok URL</label>
                  <input
                    type="text"
                    value={formData.tiktokUrl || ''}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/@haclothing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SHIPPING & CURRENCY (PKR) */}
        {activeTab === 'shipping' && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-stone-100">
              <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-800" />
                Pakistani Rupee (PKR) Shipping & Delivery Rates
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Configure delivery rates for courier fulfillment across Pakistan (TCS, Leopard, PostEx).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Standard Delivery Fee (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">Rs.</span>
                  <input
                    type="number"
                    required
                    value={formData.shippingFee}
                    onChange={(e) => setFormData({ ...formData, shippingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Above (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">Rs.</span>
                  <input
                    type="number"
                    required
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Store Currency</label>
                <input
                  type="text"
                  disabled
                  value="PKR (Rs.)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-xs font-bold text-stone-600"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">Estimated Delivery Timeframe</label>
                <input
                  type="text"
                  value={formData.deliveryDays || '2 - 4 business days across Pakistan'}
                  onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                  placeholder="2 - 4 business days across Pakistan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. STYLE INSPIRATION (ATHLETES) */}
        {activeTab === 'inspiration' && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-stone-100">
              <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                Style Inspiration Section (Babar Azam & Virat Kohli)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Customize titles, roles, and images for the athlete style inspiration section on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.styleInspirationTitle || 'Style Inspiration'}
                  onChange={(e) => setFormData({ ...formData, styleInspirationTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={formData.styleInspirationSubtitle || 'Athletic Dominance Meets Contemporary Street Silhouette'}
                  onChange={(e) => setFormData({ ...formData, styleInspirationSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                />
              </div>

              {/* Athlete 1 */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 block">
                  Athlete 1 Profile (Babar Azam)
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.styleInspirationAthlete1Name || 'Babar Azam'}
                    onChange={(e) => setFormData({ ...formData, styleInspirationAthlete1Name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Role / Description</label>
                  <input
                    type="text"
                    value={formData.styleInspirationAthlete1Role || 'Modern Cricket Icon & Trendsetter'}
                    onChange={(e) => setFormData({ ...formData, styleInspirationAthlete1Role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.styleInspirationAthlete1Image || '/images/babar_azam.jpg'}
                    onChange={(e) => setFormData({ ...formData, styleInspirationAthlete1Image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              {/* Athlete 2 */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 block">
                  Athlete 2 Profile (Virat Kohli)
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.styleInspirationAthlete2Name || 'Virat Kohli'}
                    onChange={(e) => setFormData({ ...formData, styleInspirationAthlete2Name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Role / Description</label>
                  <input
                    type="text"
                    value={formData.styleInspirationAthlete2Role || 'Global Sporting Phenomenon & Athleisure Influence'}
                    onChange={(e) => setFormData({ ...formData, styleInspirationAthlete2Role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.styleInspirationAthlete2Image || '/images/virat_kohli.jpg'}
                    onChange={(e) => setFormData({ ...formData, styleInspirationAthlete2Image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="py-3.5 px-8 rounded-2xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Syncing to Database...' : 'Save & Publish All Customizations'}
          </button>
        </div>
      </form>
    </div>
  );
};
