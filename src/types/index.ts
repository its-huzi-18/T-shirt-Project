export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Printed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ProductColor {
  name: string;
  code: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  category: string;
  images: string[];
  thumbnail: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string[];
  fabricGSM?: number;
  printType?: string;
  fit?: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount?: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: ProductColor;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  colorName: string;
  colorCode: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  area?: string;
  postalCode?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  promoBanner: string;
  showPromoBanner: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  shippingFee: number;
  freeShippingThreshold: number;
  instagramUrl?: string;
  twitterUrl?: string;
}

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'low_stock' | 'customer_signup';
  title: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CustomerUser {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  role: 'admin' | 'customer';
  addresses?: Array<{
    id: string;
    label: string;
    address: string;
    city: string;
    phone: string;
  }>;
  createdAt?: string;
}
