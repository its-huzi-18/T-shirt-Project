import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  Category,
  StoreSettings,
  AdminNotification,
  CustomerUser,
} from '../types';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

interface AdminMetrics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

interface AdminContextType {
  orders: Order[];
  notifications: AdminNotification[];
  customers: CustomerUser[];
  unreadNotifCount: number;
  metrics: AdminMetrics;
  isLoading: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  updateAdminNotes: (orderId: string, notes: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  saveProduct: (product: Partial<Product>) => Promise<string>;
  deleteProduct: (productId: string) => Promise<void>;
  duplicateProduct: (product: Product) => Promise<string>;
  saveCategory: (category: Partial<Category>) => Promise<string>;
  deleteCategory: (categoryId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  requestPushPermission: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Web Audio chime for new order
function playOrderChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch {
    // audio context might be blocked before user gesture
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const { products, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Orders
  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const loaded: Order[] = [];
        snap.forEach((d) => loaded.push({ ...d.data(), id: d.id } as Order));
        // Sort descending by date
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(loaded);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Orders snapshot listener error:', error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Subscribe to Notifications
  useEffect(() => {
    if (!isAdmin) return;

    let initialLoad = true;
    const unsubscribe = onSnapshot(
      collection(db, 'notifications'),
      (snap) => {
        const notifs: AdminNotification[] = [];
        snap.forEach((d) => notifs.push({ ...d.data(), id: d.id } as AdminNotification));
        notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Detect new order event if not initial load
        if (!initialLoad && notifs.length > notifications.length) {
          const newest = notifs[0];
          if (!newest.isRead) {
            playOrderChime();
            showToast(`🔔 ${newest.title}: ${newest.message}`, 'success');
            // Browser desktop notification if granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newest.title, {
                body: newest.message,
                icon: '/favicon.ico',
              });
            }
          }
        }
        initialLoad = false;
        setNotifications(notifs);
      },
      (error) => {
        console.warn('Notifications snapshot error:', error.message);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Fetch customers
  useEffect(() => {
    if (!isAdmin) return;
    const fetchCustomers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const list: CustomerUser[] = [];
        snap.forEach((d) => list.push(d.data() as CustomerUser));
        setCustomers(list);
      } catch (err) {
        console.warn('Customers fetch warning:', err);
      }
    };
    fetchCustomers();
  }, [isAdmin, orders]);

  // Request browser notification permission
  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Push notifications enabled for new orders!', 'success');
      }
    }
  };

  // Metrics calculation
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => (o.orderStatus !== 'Cancelled' ? acc + o.total : acc), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const processingOrders = orders.filter((o) => ['Confirmed', 'Processing', 'Printed'].includes(o.orderStatus)).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5).length;

  const metrics: AdminMetrics = {
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts,
    lowStockProducts,
  };

  // Order actions
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: status,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Order status updated to "${status}"`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: status,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Payment status updated to "${status}"`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateAdminNotes = async (orderId: string, notes: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        adminNotes: notes,
        updatedAt: new Date().toISOString(),
      });
      showToast('Internal notes saved', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      showToast(`Order #${orderId} deleted`, 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  // Product CRUD
  const saveProduct = async (productData: Partial<Product>): Promise<string> => {
    const id = productData.id || `prod-${Date.now()}`;
    const slug =
      productData.slug ||
      (productData.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const completeProduct: Product = {
      id,
      name: productData.name || 'Untitled T-Shirt',
      slug,
      description: productData.description || '',
      shortDescription: productData.shortDescription || '',
      price: Number(productData.price) || 45,
      salePrice: productData.salePrice ? Number(productData.salePrice) : null,
      sku: productData.sku || `VT-${Math.floor(100 + Math.random() * 900)}`,
      category: productData.category || 'Printed T-Shirts',
      images: productData.images && productData.images.length > 0 ? productData.images : ['/images/product_forest_tee_1790863018752.jpg'],
      thumbnail: productData.thumbnail || productData.images?.[0] || '/images/product_forest_tee_1790863018752.jpg',
      sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
      colors: productData.colors || [{ name: 'Forest Emerald', code: '#173627' }],
      stock: Number(productData.stock) ?? 20,
      status: productData.status || 'active',
      isFeatured: !!productData.isFeatured,
      isNewArrival: !!productData.isNewArrival,
      isBestSeller: !!productData.isBestSeller,
      tags: productData.tags || ['custom', 'printed'],
      fabricGSM: Number(productData.fabricGSM) || 240,
      printType: productData.printType || 'Screen Print',
      fit: productData.fit || 'Oversized Streetwear',
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'products', id), completeProduct);
      showToast(`Product "${completeProduct.name}" saved!`, 'success');
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      showToast('Product removed from catalog', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  };

  const duplicateProduct = async (product: Product): Promise<string> => {
    const newId = `prod-${Date.now()}`;
    const duplicated: Product = {
      ...product,
      id: newId,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${product.sku}-CPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'products', newId), duplicated);
      showToast(`Duplicated as "${duplicated.name}"`, 'success');
      return newId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${newId}`);
    }
  };

  // Category CRUD
  const saveCategory = async (categoryData: Partial<Category>): Promise<string> => {
    const id = categoryData.id || `cat-${Date.now()}`;
    const slug =
      categoryData.slug ||
      (categoryData.name || 'category')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const completeCategory: Category = {
      id,
      name: categoryData.name || 'New Category',
      slug,
      description: categoryData.description || '',
      imageUrl: categoryData.imageUrl || '/images/product_forest_tee_1790863018752.jpg',
      productCount: categoryData.productCount || 0,
    };

    try {
      await setDoc(doc(db, 'categories', id), completeCategory);
      showToast(`Category "${completeCategory.name}" saved!`, 'success');
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${id}`);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      showToast('Category deleted', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
    }
  };

  // Settings
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      await setDoc(doc(db, 'settings', 'store'), newSettings, { merge: true });
      showToast('Website customization settings saved!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/store');
    }
  };

  // Notifications
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (err) {
      console.warn('Notification update error:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      for (const n of notifications.filter((n) => !n.isRead)) {
        await updateDoc(doc(db, 'notifications', n.id), { isRead: true });
      }
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      console.warn('Notifications bulk read error:', err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        orders,
        notifications,
        customers,
        unreadNotifCount,
        metrics,
        isLoading,
        updateOrderStatus,
        updatePaymentStatus,
        updateAdminNotes,
        deleteOrder,
        saveProduct,
        deleteProduct,
        duplicateProduct,
        saveCategory,
        deleteCategory,
        updateSettings,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        requestPushPermission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
