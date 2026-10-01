import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    showToast('Inquiry sent! A studio artisan will respond within 24 business hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
          We&apos;re Here To Assist
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#173627]">
          Connect With Our Studio
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Have questions regarding an active order, bulk corporate screen printing, or size guidance? Reach our studio directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#173627]">Direct Email</h4>
            <p className="text-xs text-stone-500">For order inquiries, artist submissions, and wholesale:</p>
            <p className="text-sm font-bold text-stone-900">{settings.contactEmail || 'studio@verdantthreads.com'}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#173627]">Customer Care Line</h4>
            <p className="text-xs text-stone-500">Monday to Friday, 9:00 AM – 6:00 PM EST:</p>
            <p className="text-sm font-bold text-stone-900">{settings.contactPhone || '+1 (800) 837-3268'}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#173627]">Studio Workshop & Fulfillment</h4>
            <p className="text-xs text-stone-500">Pickups and bespoke consultations:</p>
            <p className="text-sm font-bold text-stone-900">{settings.address || '412 Artisan Way, New York, NY 10013'}</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="font-heading font-black text-xl text-[#173627]">Message Received</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you! Our studio team will get back to you at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#173627] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-black text-lg text-[#173627]">Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Taylor Bell"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="taylor@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627] bg-white"
                  >
                    <option value="Order Inquiry">Order Inquiry / Tracking Update</option>
                    <option value="Custom Screen Printing">Custom Screen Printing / Bulk Studio</option>
                    <option value="Size & Fit Consultation">Size & Fit Consultation</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Artist Collaboration">Artist & Graphic Submissions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need or include your Order reference..."
                    className="w-full p-3.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#173627]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
