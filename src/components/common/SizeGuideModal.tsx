import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const dataInches = [
    { size: 'XS', chest: '36 - 38', length: '27.5', shoulder: '18.0' },
    { size: 'S', chest: '38 - 40', length: '28.5', shoulder: '19.0' },
    { size: 'M', chest: '41 - 43', length: '29.5', shoulder: '20.5' },
    { size: 'L', chest: '44 - 46', length: '30.5', shoulder: '21.5' },
    { size: 'XL', chest: '47 - 49', length: '31.5', shoulder: '22.5' },
    { size: 'XXL', chest: '50 - 52', length: '32.5', shoulder: '23.5' },
    { size: 'XXXL', chest: '53 - 55', length: '33.5', shoulder: '24.5' },
  ];

  const dataCm = [
    { size: 'XS', chest: '91 - 96', length: '70', shoulder: '46' },
    { size: 'S', chest: '96 - 101', length: '72', shoulder: '48' },
    { size: 'M', chest: '104 - 109', length: '75', shoulder: '52' },
    { size: 'L', chest: '112 - 117', length: '77', shoulder: '55' },
    { size: 'XL', chest: '119 - 124', length: '80', shoulder: '57' },
    { size: 'XXL', chest: '127 - 132', length: '82', shoulder: '60' },
    { size: 'XXXL', chest: '135 - 140', length: '85', shoulder: '62' },
  ];

  const currentData = unit === 'inches' ? dataInches : dataCm;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-stone-200 p-6 sm:p-8 z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-[#173627]" />
              <h3 className="text-xl font-bold font-heading text-[#173627]">Size & Fit Guide</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Our tees feature a modern streetwear oversized fit. For standard fit, order one size down.
            </p>
            {/* Unit switch */}
            <div className="flex bg-stone-200 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'inches' ? 'bg-[#173627] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'cm' ? 'bg-[#173627] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#173627] text-[#FAF7F2] text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Size</th>
                  <th className="py-3 px-4 font-semibold">Chest ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="py-3 px-4 font-semibold">Length ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="py-3 px-4 font-semibold">Shoulder Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {currentData.map((row) => (
                  <tr key={row.size} className="hover:bg-stone-50 transition-colors font-medium">
                    <td className="py-2.5 px-4 font-bold text-[#173627]">{row.size}</td>
                    <td className="py-2.5 px-4">{row.chest}</td>
                    <td className="py-2.5 px-4">{row.length}</td>
                    <td className="py-2.5 px-4">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold">Pro Tip:</span>
            <span>All shirts are pre-shrunk via industrial enzyme washing to ensure zero shrinkage after your first wash. Wash cold inside-out.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
