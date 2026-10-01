import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onNavigateAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onNavigateAdmin }) => {
  const { cartCount, wishlist, settings, setIsCartOpen, setIsSearchOpen, setIsAuthModalOpen } = useStore();
  const { currentUser, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'oversized', label: 'Oversized' },
    { id: 'graphic', label: 'Graphic Tees' },
    { id: 'custom-print', label: 'Custom Studio' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'about', label: 'About' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all">
        {/* Top Promo Banner */}
        {settings.showPromoBanner && (
          <div className="bg-[#0E2218] text-[#FAF7F2] py-2 px-4 text-center text-xs font-semibold tracking-wider uppercase border-b border-emerald-950/50 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{settings.promoBanner}</span>
          </div>
        )}

        {/* Main Navbar */}
        <nav className="glass-nav border-b border-stone-200/80 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 sm:h-20">
              {/* Mobile Menu Button */}
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-stone-700 hover:text-[#173627] hover:bg-stone-200/60 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {/* Brand Logo */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
                <div className="w-10 h-10 rounded-xl bg-[#173627] text-[#FAF7F2] flex items-center justify-center font-heading font-black text-xl shadow-md border border-emerald-900">
                  V
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black tracking-tight text-lg sm:text-xl text-[#173627] leading-none">
                    {settings.brandName || 'VERDANT THREADS'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/80 mt-0.5 hidden sm:block">
                    Artisan Heavyweight Apparel
                  </span>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      currentPage === link.id
                        ? 'bg-[#173627] text-white shadow-xs'
                        : 'text-stone-700 hover:text-[#173627] hover:bg-stone-200/50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl text-stone-700 hover:text-[#173627] hover:bg-stone-200/50 transition-colors"
                  aria-label="Search"
                  title="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="p-2.5 rounded-xl text-stone-700 hover:text-[#173627] hover:bg-stone-200/50 transition-colors relative"
                  aria-label="Wishlist"
                  title="Your Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Account Button */}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2.5 rounded-xl text-stone-700 hover:text-[#173627] hover:bg-stone-200/50 transition-colors relative"
                  aria-label="Account"
                  title={currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Sign In'}
                >
                  <User className="w-5 h-5" />
                  {currentUser && (
                    <span className="absolute bottom-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </button>

                {/* Admin Access Quick Button */}
                <button
                  onClick={onNavigateAdmin}
                  className={`hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                    isAdmin
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900 shadow-xs'
                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                  title="Store Admin Panel"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Admin</span>
                </button>

                {/* Shopping Bag Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="ml-1 flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white shadow-md hover:shadow-lg transition-all"
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">Bag</span>
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-stone-900 font-extrabold text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FAF7F2] p-6 shadow-2xl z-10 flex flex-col justify-between border-r border-stone-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#173627] text-white flex items-center justify-center font-heading font-black">
                    V
                  </div>
                  <span className="font-heading font-black text-[#173627] tracking-tight">
                    {settings.brandName || 'VERDANT THREADS'}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="py-6 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-between transition-colors ${
                      currentPage === link.id
                        ? 'bg-[#173627] text-white'
                        : 'text-stone-700 hover:bg-stone-200/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <button
                onClick={() => {
                  onNavigateAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-emerald-950 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Open Admin Dashboard
              </button>

              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs uppercase tracking-wider text-center"
              >
                {currentUser ? 'Manage Account' : 'Customer Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
