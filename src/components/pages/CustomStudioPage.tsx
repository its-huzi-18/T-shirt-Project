import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  Sparkles,
  Layers,
  Ruler,
  Check,
  ShoppingBag,
  Info,
  Maximize2,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface CustomStudioPageProps {
  onOrderCustomTshirt: () => void;
}

export const CustomStudioPage: React.FC<CustomStudioPageProps> = ({ onOrderCustomTshirt }) => {
  const { addToCart, settings, showToast } = useStore();

  const [tshirtColor, setTshirtColor] = useState<{ name: string; code: string; previewBg: string }>({
    name: 'Forest Emerald',
    code: '#173627',
    previewBg: 'bg-[#173627]',
  });
  const [fabricWeight, setFabricWeight] = useState<'240 GSM' | '280 GSM Luxury Boxy'>('280 GSM Luxury Boxy');
  const [placement, setPlacement] = useState<'front-center' | 'back-large' | 'left-chest'>('back-large');
  const [customSize, setCustomSize] = useState('L');
  const [customQuantity, setCustomQuantity] = useState(1);
  const [uploadedArt, setUploadedArt] = useState<string | null>(null);
  const [artPositionX, setArtPositionX] = useState(50);
  const [artPositionY, setArtPositionY] = useState(45);
  const [artScale, setArtScale] = useState(70);

  const colors = [
    { name: 'Forest Emerald', code: '#173627', previewBg: 'bg-[#173627]' },
    { name: 'Washed Black', code: '#1E1E1E', previewBg: 'bg-[#1E1E1E]' },
    { name: 'Raw Cream', code: '#F5EFEB', previewBg: 'bg-[#F5EFEB]' },
    { name: 'Artisan Sand', code: '#E4DAC8', previewBg: 'bg-[#E4DAC8]' },
    { name: 'Pure White', code: '#FFFFFF', previewBg: 'bg-white' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a PNG, JPG, or SVG artwork file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedArt(reader.result as string);
      showToast('Artwork uploaded! Previewing on mockup canvas.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    const customProduct: Product = {
      id: `custom-shirt-${Date.now()}`,
      name: `Custom Studio Tee (${placement.replace('-', ' ').toUpperCase()})`,
      slug: 'custom-studio-tee',
      description: `Custom printed t-shirt with uploaded customer artwork. Fabric: ${fabricWeight}. Print position: ${placement}.`,
      shortDescription: `${fabricWeight} custom printed tee with custom artwork.`,
      price: fabricWeight.includes('280') ? 54 : 48,
      sku: 'VT-CUSTOM-01',
      category: 'Custom T-Shirts',
      images: [
        uploadedArt || '/src/assets/images/hero_tshirt_banner_1790863003479.jpg',
      ],
      thumbnail: uploadedArt || '/src/assets/images/hero_tshirt_banner_1790863003479.jpg',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: tshirtColor.name, code: tshirtColor.code }],
      stock: 100,
      status: 'active',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      tags: ['custom', 'custom-art', 'print-on-demand'],
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addToCart(customProduct, customSize, { name: tshirtColor.name, code: tshirtColor.code }, customQuantity);
    showToast('Your custom design has been added to your shopping bag!', 'success');
    onOrderCustomTshirt();
  };

  const unitPrice = fabricWeight.includes('280') ? 54 : 48;
  const totalPrice = unitPrice * customQuantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          Artisan Screen & DTG Custom Workshop
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#173627]">
          Design Your Signature Custom Tee
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Upload your illustration, typography, or brand graphic. We inspect your artwork, separate screens, and print on heavyweight combed organic cotton.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        {/* Left: Interactive Canvas Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-lg aspect-4/5 rounded-3xl bg-stone-200/70 p-6 flex items-center justify-center relative overflow-hidden border border-stone-300 shadow-xl">
            {/* T-Shirt Silhouette Container */}
            <div
              className={`relative w-80 h-96 sm:w-96 sm:h-[430px] rounded-3xl transition-colors duration-500 shadow-2xl flex items-center justify-center ${
                tshirtColor.name === 'Forest Emerald'
                  ? 'bg-[#173627] text-white'
                  : tshirtColor.name === 'Washed Black'
                  ? 'bg-[#1e1e1e] text-white'
                  : tshirtColor.name === 'Raw Cream'
                  ? 'bg-[#f5efeb] text-stone-900'
                  : tshirtColor.name === 'Artisan Sand'
                  ? 'bg-[#e4dac8] text-stone-900'
                  : 'bg-white text-stone-900'
              }`}
            >
              {/* Collar Detail */}
              <div className="absolute top-2 w-28 h-10 border-b-4 border-black/15 rounded-b-full mx-auto" />

              {/* Sleeve hints */}
              <div className="absolute -left-6 top-8 w-12 h-28 bg-inherit rounded-l-2xl opacity-90 -rotate-12 border-l border-black/10" />
              <div className="absolute -right-6 top-8 w-12 h-28 bg-inherit rounded-r-2xl opacity-90 rotate-12 border-r border-black/10" />

              {/* Print Boundary Box */}
              <div
                className={`absolute border border-dashed rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden ${
                  placement === 'front-center'
                    ? 'top-24 w-44 h-52 border-white/40'
                    : placement === 'back-large'
                    ? 'top-16 w-56 h-68 border-white/40'
                    : 'top-20 left-12 w-20 h-20 border-white/40'
                }`}
              >
                {uploadedArt ? (
                  <img
                    src={uploadedArt}
                    alt="Custom Uploaded Artwork"
                    style={{
                      transform: `scale(${artScale / 100})`,
                    }}
                    className="max-w-full max-h-full object-contain filter drop-shadow-md select-none transition-transform"
                  />
                ) : (
                  <div className="p-4 text-center">
                    <Upload className="w-6 h-6 mx-auto opacity-50 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {placement.replace('-', ' ')} Print Area
                    </span>
                  </div>
                )}
              </div>

              {/* Mockup labels */}
              <div className="absolute bottom-4 left-4 text-[10px] font-mono uppercase tracking-widest opacity-60">
                {tshirtColor.name} • {fabricWeight}
              </div>
            </div>

            {/* Clear artwork button if present */}
            {uploadedArt && (
              <button
                onClick={() => setUploadedArt(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-stone-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors"
                title="Remove Artwork"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Scale Slider if artwork uploaded */}
          {uploadedArt && (
            <div className="w-full max-w-lg mt-4 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-stone-700">Artwork Size: {artScale}%</span>
              <input
                type="range"
                min={40}
                max={120}
                value={artScale}
                onChange={(e) => setArtScale(Number(e.target.value))}
                className="flex-1 accent-[#173627]"
              />
            </div>
          )}
        </div>

        {/* Right: Studio Customization Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Upload artwork */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Upload Your Graphic / Logo
            </h3>

            <label className="border-2 border-dashed border-stone-300 hover:border-[#173627] bg-stone-50/50 hover:bg-stone-50 rounded-2xl p-6 text-center cursor-pointer block transition-colors">
              <Upload className="w-8 h-8 text-emerald-800 mx-auto mb-2" />
              <span className="text-xs font-bold text-stone-800 block">Click to select or drop graphic</span>
              <span className="text-[11px] text-stone-400 mt-1 block">Supports PNG (transparent background recommended), JPG, SVG</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Step 2: Choose Garment Color */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              Select Shirt Color: <span className="font-bold text-emerald-800">{tshirtColor.name}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setTshirtColor(c)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    tshirtColor.name === c.name
                      ? 'border-[#173627] bg-[#173627] text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                    style={{ backgroundColor: c.code }}
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Print Placement */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Print Placement
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'back-large', label: 'Full Back Print' },
                { id: 'front-center', label: 'Chest Center' },
                { id: 'left-chest', label: 'Pocket Emblem' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlacement(p.id as typeof placement)}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold text-center transition-all ${
                    placement === p.id
                      ? 'border-[#173627] bg-[#173627] text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Fabric Weight & Size */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm text-[#173627] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#173627] text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              Fabric Weight & Fit
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '280 GSM Luxury Boxy', price: 54, desc: 'Ultra-heavy drop shoulder cut' },
                { label: '240 GSM Combed Jersey', price: 48, desc: 'Everyday heavyweight luxury' },
              ].map((fw) => (
                <div
                  key={fw.label}
                  onClick={() => setFabricWeight(fw.label as typeof fabricWeight)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    fabricWeight === fw.label
                      ? 'border-[#173627] bg-emerald-50/50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <p className="font-bold text-xs text-[#173627]">{fw.label}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{fw.desc}</p>
                  <span className="text-sm font-black text-stone-900 mt-2 block">
                    {settings.currencySymbol || '$'}{fw.price}.00
                  </span>
                </div>
              ))}
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Garment Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCustomSize(s)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      customSize === s
                        ? 'bg-[#173627] text-white border-[#173627]'
                        : 'bg-white border-stone-200 text-stone-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="p-6 rounded-3xl bg-[#173627] text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                  Custom Studio Total
                </span>
                <div className="text-2xl font-black mt-0.5">
                  {settings.currencySymbol || '$'}{totalPrice.toFixed(2)}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center bg-white/10 rounded-xl px-2">
                <button
                  onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
                  className="w-8 h-9 flex items-center justify-center font-bold text-white hover:text-emerald-300"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold">{customQuantity}</span>
                <button
                  onClick={() => setCustomQuantity(customQuantity + 1)}
                  className="w-8 h-9 flex items-center justify-center font-bold text-white hover:text-emerald-300"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#C2A24D] text-stone-900 font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add Custom Shirt to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
