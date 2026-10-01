import React from 'react';
import { Shield, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="space-y-4 pb-8 border-b border-stone-200">
        <div className="flex items-center gap-2 text-emerald-800">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Legal Document</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#173627]">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026 • Verdant Threads Inc.</p>
      </div>

      <div className="mt-8 prose prose-stone max-w-none text-xs sm:text-sm text-stone-600 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">1. Information We Collect</h2>
          <p>
            When you purchase apparel or create an account with {settings.brandName || 'Verdant Threads'}, we collect necessary personal details including your name, shipping address, contact phone number, and email. This data is utilized strictly for order fulfillment, courier transit updates, and customer support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">2. Data Security & Storage</h2>
          <p>
            Customer records are securely retained inside Google Cloud Firestore databases adhering to zero-trust attribute access rules. Payment information processed via card networks is tokenized with industry standard 256-bit encryption; we never store raw credit card numbers on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">3. Custom Artwork Rights</h2>
          <p>
            Any custom designs or illustrations uploaded to our Custom Printing Studio remain 100% your intellectual property. We process uploaded imagery strictly to calibrate print screens and inspect vector alignment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">4. Contact & Inquiries</h2>
          <p>
            For privacy inquiries or data removal requests, contact our privacy compliance team at{' '}
            <strong className="text-stone-900">{settings.contactEmail || 'studio@verdantthreads.com'}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="space-y-4 pb-8 border-b border-stone-200">
        <div className="flex items-center gap-2 text-emerald-800">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Store Regulations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#173627]">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026 • Verdant Threads Inc.</p>
      </div>

      <div className="mt-8 prose prose-stone max-w-none text-xs sm:text-sm text-stone-600 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">1. Orders & Pricing</h2>
          <p>
            All listed prices are displayed in {settings.currency || 'USD'} and include precision screen printing and quality curing. We reserve the right to correct typographical pricing discrepancies or cancel orders placed with fraudulent intent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">2. Cash on Delivery (COD) Terms</h2>
          <p>
            When selecting Cash on Delivery, customers agree to be reachable at the designated delivery phone number and prepare exact cash or mobile terminal payment upon courier arrival.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">3. Returns & Exchange Guarantee</h2>
          <p>
            We offer a 14-day exchange window for unworn, unwashed garments with original tags intact. If you require a different size or fit, our studio provides prepaid exchange return labels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#173627] font-heading">4. Custom Merchandise Terms</h2>
          <p>
            Custom printed garments featuring customer-uploaded artwork are made-to-order and cannot be refunded unless a physical garment defect or print discoloration is verified upon delivery.
          </p>
        </section>
      </div>
    </div>
  );
};
