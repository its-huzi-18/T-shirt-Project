import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onExitToStore: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onExitToStore }) => {
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Invalid email or password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.error || 'Invalid email or password');
      }
    } catch {
      setErrorMessage('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E2218] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-950 space-y-6">
        {/* Brand Monogram */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-black font-heading text-[#173627]">
            HA Clothing Admin
          </h2>
          <p className="text-xs text-stone-500">
            Secure administrative console. Please enter authorized credentials.
          </p>
        </div>

        {/* Error message - generic as requested */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@haclothing.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#173627]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#173627]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            {isLoading ? 'Verifying...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-200 text-center">
          <button
            onClick={onExitToStore}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
