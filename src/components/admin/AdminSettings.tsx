import React, { useState } from 'react';
import { Save, Sparkles, Globe, DollarSign, Phone, Mail, MapPin, Truck, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { updateSettings } = useAdmin();
  const { settings } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="text-xl font-black font-heading text-[#173627]">Website & Brand Customization</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Modify the live homepage headlines, banner announcements, currency, shipping fees, and contact details without editing any code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-800" />
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Customization */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-800" />
            Homepage Hero Section
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Large Hero Headline</label>
              <input
                type="text"
                required
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                placeholder="WEAR YOUR CREATIVITY"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold font-heading"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Hero Subheading</label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Promo Announcement Banner */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-sm text-[#173627]">
            Top Announcement Ticker
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ticker Message</label>
              <input
                type="text"
                value={formData.promoBanner}
                onChange={(e) => setFormData({ ...formData, promoBanner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showPromoBanner}
                onChange={(e) => setFormData({ ...formData, showPromoBanner: e.target.checked })}
                className="accent-[#173627] rounded-sm"
              />
              Show Top Announcement Bar on Storefront
            </label>
          </div>
        </div>

        {/* Pricing & Shipping Rules */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-800" />
            Currency & Shipping Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Currency Code</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Flat Shipping Fee</label>
              <input
                type="number"
                step="0.5"
                value={formData.shippingFee}
                onChange={(e) => setFormData({ ...formData, shippingFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Free Shipping Threshold</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact & Studio Address */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-800" />
            Contact & Studio Physical Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Studio Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
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
