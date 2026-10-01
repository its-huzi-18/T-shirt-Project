import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Product,
  Category,
  CartItem,
  Order,
  StoreSettings,
  ProductReview,
  AdminNotification,
  ProductColor,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
} from '../lib/initialData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  toasts: ToastState[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  cartTotal: number;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addToCart: (
    product: Product,
    size: string,
    color: ProductColor,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  updateCartItemOptions: (
    cartItemId: string,
    size: string,
    color: ProductColor
  ) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    area?: string;
    postalCode?: string;
    paymentMethod: 'cod' | 'card';
    customerNotes?: string;
    customerId?: string | null;
  }) => Promise<{ orderId: string; orderNumber: string }>;
  fetchOrderForTracking: (orderNumber: string, phone: string) => Promise<Order | null>;
  addReview: (productId: string, name: string, rating: number, comment: string) => Promise<void>;
  getProductReviews: (productId: string) => Promise<ProductReview[]>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Seed initial data to firestore if empty
  useEffect(() => {
    const seedInitialData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          // Seed products
          for (const p of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', p.id), p);
          }
          // Seed categories
          for (const c of INITIAL_CATEGORIES) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
          // Seed settings
          await setDoc(doc(db, 'settings', 'store'), INITIAL_SETTINGS);
        }
      } catch (err) {
        console.warn('Initial seeding bypassed or already initialized:', err);
      }
    };
    seedInitialData();
  }, []);

  // Subscribe to live products
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Product[] = [];
          snap.forEach((docSnap) => loaded.push({ ...docSnap.data(), id: docSnap.id } as Product));
          setProducts(loaded);
        }
      },
      (error) => {
        console.warn('Live products listener fallback:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to live categories
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Category[] = [];
          snap.forEach((docSnap) => loaded.push({ ...docSnap.data(), id: docSnap.id } as Category));
          setCategories(loaded);
        }
      },
      (error) => {
        console.warn('Live categories listener fallback:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to live store settings
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'store'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as StoreSettings);
        }
      },
      (error) => {
        console.warn('Live settings listener fallback:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('vt_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('vt_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    size: string,
    color: ProductColor,
    quantity: number = 1
  ) => {
    if (!size) {
      showToast('Please select a size', 'error');
      return;
    }
    if (!color) {
      showToast('Please select a color', 'error');
      return;
    }

    const cartItemId = `${product.id}-${size}-${color.name}`.replace(/\s+/g, '-').toLowerCase();

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        );
      }
      const newItem: CartItem = {
        cartItemId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.salePrice ?? product.price,
        image: product.thumbnail || product.images[0] || '',
        size,
        color,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock,
      };
      return [...prev, newItem];
    });

    showToast(`Added "${product.name}" (${size}, ${color.name}) to cart!`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(newQty, item.stock) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateCartItemOptions = (
    cartItemId: string,
    size: string,
    color: ProductColor
  ) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cartItemId === cartItemId);
      if (!item) return prev;
      const newCartItemId = `${item.productId}-${size}-${color.name}`.replace(/\s+/g, '-').toLowerCase();
      return prev.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, cartItemId: newCartItemId, size, color }
          : i
      );
    });
    showToast('Cart item updated', 'success');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart financial calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = cartSubtotal >= (settings.freeShippingThreshold || 5000);
  const shippingFee = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : (settings.shippingFee ?? 250);
  const cartTotal = cartSubtotal + shippingFee;

  // Place Order function
  const createOrder = async (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    area?: string;
    postalCode?: string;
    paymentMethod: 'cod' | 'card';
    customerNotes?: string;
    customerId?: string | null;
  }) => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty');
    }

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = orderNumber.toLowerCase();

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      size: item.size,
      colorName: item.color.name,
      colorCode: item.color.code,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: orderPayload.customerId || null,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      address: orderPayload.address,
      city: orderPayload.city,
      area: orderPayload.area || '',
      postalCode: orderPayload.postalCode || '',
      items: orderItems,
      subtotal: cartSubtotal,
      shipping: shippingFee,
      total: cartTotal,
      currency: 'PKR',
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'Pending',
      customerNotes: orderPayload.customerNotes || '',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Save order to firestore
      await setDoc(doc(db, 'orders', orderId), newOrder);

      // 2. Create in-app admin notification
      const notificationId = `notif-${Date.now()}`;
      const notification: AdminNotification = {
        id: notificationId,
        type: 'new_order',
        title: 'New Order Received',
        message: `Order #${orderNumber} from ${orderPayload.customerName} (${settings.currencySymbol || 'Rs. '}${Math.round(cartTotal).toLocaleString()})`,
        orderId,
        orderNumber,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'notifications', notificationId), notification);

      // 3. Decrement stock for purchased products
      for (const item of cart) {
        try {
          const productRef = doc(db, 'products', item.productId);
          const currentProd = products.find((p) => p.id === item.productId);
          if (currentProd) {
            const updatedStock = Math.max(0, currentProd.stock - item.quantity);
            await updateDoc(productRef, { stock: updatedStock });
          }
        } catch (stockErr) {
          console.warn('Could not update stock:', stockErr);
        }
      }

      // 4. Clear cart and notify
      clearCart();
      showToast(`Order #${orderNumber} placed successfully!`, 'success');

      return { orderId, orderNumber };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  // Order Tracking
  const fetchOrderForTracking = async (orderNumberInput: string, phoneInput: string): Promise<Order | null> => {
    const cleanNumber = orderNumberInput.trim().toUpperCase();
    const cleanPhone = phoneInput.trim().replace(/\D/g, '');

    try {
      // Try direct doc lookup
      const directDoc = await getDoc(doc(db, 'orders', cleanNumber.toLowerCase()));
      if (directDoc.exists()) {
        const orderData = directDoc.data() as Order;
        const storedPhone = orderData.customerPhone.replace(/\D/g, '');
        if (storedPhone.includes(cleanPhone) || cleanPhone.includes(storedPhone) || cleanPhone === '') {
          return orderData;
        }
      }

      // Query by orderNumber field
      const q = query(collection(db, 'orders'), where('orderNumber', '==', cleanNumber));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const orderData = querySnap.docs[0].data() as Order;
        const storedPhone = orderData.customerPhone.replace(/\D/g, '');
        if (storedPhone.includes(cleanPhone) || cleanPhone.includes(storedPhone) || cleanPhone === '') {
          return orderData;
        }
      }

      return null;
    } catch (error) {
      console.warn('Order tracking fetch error:', error);
      return null;
    }
  };

  // Product reviews
  const addReview = async (productId: string, name: string, rating: number, comment: string) => {
    const reviewId = `rev-${Date.now()}`;
    const newReview: ProductReview = {
      id: reviewId,
      productId,
      customerName: name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'reviews', reviewId), newReview);
      showToast('Thank you! Your review has been submitted.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${reviewId}`);
    }
  };

  const getProductReviews = async (productId: string): Promise<ProductReview[]> => {
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const snap = await getDocs(q);
      const reviews: ProductReview[] = [];
      snap.forEach((d) => reviews.push(d.data() as ProductReview));
      return reviews;
    } catch {
      return [];
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        isAuthModalOpen,
        toasts,
        cartCount,
        cartSubtotal,
        shippingFee,
        isFreeShipping,
        cartTotal,
        setIsCartOpen,
        setIsSearchOpen,
        setIsAuthModalOpen,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemOptions,
        clearCart,
        toggleWishlist,
        isInWishlist,
        createOrder,
        fetchOrderForTracking,
        addReview,
        getProductReviews,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
