export interface ProductImage {
  id: number;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  color_name: string;
  color_hex: string | null;
  stock: number;
  images: ProductImage[];
}

export interface LensOption {
  id: number;
  name: string;
  lens_type: "lens-type" | "coating" | "addon";
  price: number;
  description: string | null;
}

export interface LensOptionGroup {
  lens_type: LensOption[];
  coating: LensOption[];
  addon: LensOption[];
}

export interface LensCollection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  hero_image_url: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: "eyeglasses" | "sunglasses" | "contact-lenses" | "accessories";
  gender: "men" | "women" | "unisex" | "kids";
  frame_shape: string | null;
  rim_type: string | null;
  material: string | null;
  brand: string | null;
  base_price: number;
  sale_price: number | null;
  bullets: string[];
  description: string;
  is_prescription_required: boolean;
  is_featured: boolean;
  is_active: boolean;
  variants: ProductVariant[];
  lens_options: LensOptionGroup;
  average_rating: number | null;
  review_count: number;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  category: string;
  gender: string;
  base_price: number;
  sale_price: number | null;
  is_featured: boolean;
  thumbnail_url: string | null;
  average_rating: number | null;
  review_count: number;
}

export interface PrescriptionData {
  method: "upload" | "manual" | "later";
  right_sph?: number;
  right_cyl?: number;
  right_axis?: number;
  right_add?: number;
  left_sph?: number;
  left_cyl?: number;
  left_axis?: number;
  left_add?: number;
  pd?: number;
  prescription_url?: string;
}

export interface CartItem {
  product_id: number;
  product_name: string;
  product_slug: string;
  thumbnail_url: string | null;
  variant_id: number;
  color_name: string;
  base_price: number;
  sale_price: number | null;
  quantity: number;
  selected_lens_options: number[];
  lens_options_price: number;
  prescription: PrescriptionData | null;
}

export interface PromoCode {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number | null;
}

export interface Order {
  id: number;
  order_number: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  payment_method: "cod" | "easypaisa" | "jazzcash" | "bank_transfer";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  province: string;
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  payment_discount: number;
  coupon_discount: number;
  total: number;
  notes: string | null;
  tracking_number: string | null;
  promo_code: string | null;
  prescription_method: "upload" | "manual" | "later" | null;
  prescription_url: string | null;
  prescription_data: PrescriptionData | null;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  customer_name: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  cover_image_url: string | null;
  category: "lens-guide" | "frame-style" | "eye-health" | "prescription-tips";
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: "orders" | "prescription" | "payments" | "fitting" | "general";
  sort_order: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
}

export interface CartStore {
  items: CartItem[];
  paymentMethod: string;
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  setPaymentMethod: (method: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getPaymentDiscount: () => number;
  getTotal: () => number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
}
