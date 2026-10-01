import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';

import { HomePage } from './components/pages/HomePage';
import { ShopPage } from './components/pages/ShopPage';
import { ProductDetailsPage } from './components/pages/ProductDetailsPage';
import { CustomStudioPage } from './components/pages/CustomStudioPage';
import { CartPage } from './components/pages/CartPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { OrderSuccessPage } from './components/pages/OrderSuccessPage';
import { OrderTrackingPage } from './components/pages/OrderTrackingPage';
import { WishlistPage } from './components/pages/WishlistPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicyPage, TermsPage } from './components/pages/PolicyPages';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product } from './types';

function AppContent() {
  const { isSearchOpen, setIsSearchOpen, isAuthModalOpen, setIsAuthModalOpen, settings } = useStore();

  // Navigation Routing State
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('all');
  const [completedOrder, setCompletedOrder] = useState<{ id: string; number: string } | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Handle browser back/forward or hash
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update dynamic document title based on page
  useEffect(() => {
    const base = settings.brandName || 'Verdant Threads';
    if (currentPage === 'admin') {
      document.title = `${base} — Studio Administration`;
    } else if (currentPage === 'product-detail' && selectedProduct) {
      document.title = `${selectedProduct.name} | ${base}`;
    } else if (currentPage === 'shop') {
      document.title = `Heavyweight Catalog | ${base}`;
    } else if (currentPage === 'custom-print') {
      document.title = `Custom Printing Studio | ${base}`;
    } else if (currentPage === 'checkout') {
      document.title = `Checkout | ${base}`;
    } else if (currentPage === 'tracking') {
      document.title = `Track Live Order | ${base}`;
    } else {
      document.title = `${base} — Premium Custom Printed T-Shirts`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct, settings.brandName]);

  const handleNavigate = (page: string, categorySlug?: string) => {
    if (categorySlug) {
      setInitialCategory(categorySlug);
    } else if (page === 'oversized') {
      setInitialCategory('oversized-tshirts');
      setCurrentPage('shop');
      return;
    } else if (page === 'graphic') {
      setInitialCategory('graphic-tshirts');
      setCurrentPage('shop');
      return;
    } else {
      setInitialCategory('all');
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleOrderSuccess = (orderId: string, orderNumber: string) => {
    setCompletedOrder({ id: orderId, number: orderNumber });
    setCurrentPage('order-success');
  };

  const handleTrackFromSuccess = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setCurrentPage('tracking');
  };

  // If in Admin Console, render standalone dashboard layout
  if (currentPage === 'admin') {
    return (
      <>
        <ToastContainer />
        <AdminDashboard onExitToStore={() => setCurrentPage('home')} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Global Modals & Drawers */}
      <CartDrawer
        onNavigateToCheckout={() => setCurrentPage('checkout')}
        onNavigateToCart={() => setCurrentPage('cart')}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onNavigateAdmin={() => setCurrentPage('admin')}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigateShop={(cat) => handleNavigate('shop', cat)}
            onNavigateProduct={handleSelectProduct}
            onNavigateCustomStudio={() => setCurrentPage('custom-print')}
            onNavigateTracking={() => setCurrentPage('tracking')}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            initialCategory={initialCategory}
            onSelectProduct={handleSelectProduct}
            onNavigateCustomStudio={() => setCurrentPage('custom-print')}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onNavigateToCheckout={() => setCurrentPage('checkout')}
            onBackToShop={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'custom-print' && (
          <CustomStudioPage onOrderCustomTshirt={() => setCurrentPage('cart')} />
        )}

        {currentPage === 'cart' && (
          <CartPage
            onNavigateToCheckout={() => setCurrentPage('checkout')}
            onContinueShopping={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => setCurrentPage('cart')}
          />
        )}

        {currentPage === 'order-success' && completedOrder && (
          <OrderSuccessPage
            orderId={completedOrder.id}
            orderNumber={completedOrder.number}
            onTrackOrder={handleTrackFromSuccess}
            onContinueShopping={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'tracking' && (
          <OrderTrackingPage initialOrderNumber={trackingOrderNumber} />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onNavigateShop={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateShop={() => setCurrentPage('shop')}
            onNavigateCustomStudio={() => setCurrentPage('custom-print')}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'privacy' && <PrivacyPolicyPage />}

        {currentPage === 'terms' && <TermsPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
