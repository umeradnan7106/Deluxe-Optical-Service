import axios from "axios";
import type {
  Product,
  ProductListItem,
  Order,
  Review,
  Blog,
  FAQ,
  LensCollection,
  User,
  PromoCode,
  PaginatedResponse,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      try {
        const state = JSON.parse(raw)?.state;
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      } catch {
        // ignore malformed storage
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        try {
          const state = JSON.parse(raw)?.state;
          if (state?.refreshToken) {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
              { refresh_token: state.refreshToken }
            );
            const newToken = data.access_token;
            const stored = JSON.parse(raw);
            stored.state.accessToken = newToken;
            localStorage.setItem("auth-storage", JSON.stringify(stored));
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        } catch {
          localStorage.removeItem("auth-storage");
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { email: string; password: string; full_name: string; phone?: string }) =>
    api.post<{ access_token: string; refresh_token: string; user: User }>("/api/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string; refresh_token: string; user: User }>("/api/auth/login", data),
  refresh: (refresh_token: string) =>
    api.post<{ access_token: string }>("/api/auth/refresh", { refresh_token }),
  logout: (refresh_token: string) =>
    api.post("/api/auth/logout", { refresh_token }),
  me: () => api.get<User>("/api/auth/me"),
  updateProfile: (data: { full_name?: string; phone?: string }) =>
    api.patch<User>("/api/auth/me", data),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post("/api/auth/change-password", data),
};

// ── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<PaginatedResponse<ProductListItem>>("/api/products", { params }),
  detail: (slug: string) =>
    api.get<Product>(`/api/products/${slug}`),
  search: (q: string) =>
    api.get<ProductListItem[]>("/api/products/search", { params: { q } }),
  featured: () =>
    api.get<ProductListItem[]>("/api/products/featured"),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
  create: (data: unknown) =>
    api.post<Order>("/api/orders", data),
  track: (orderNumber: string, email: string) =>
    api.get<Order>("/api/orders/track", { params: { order_number: orderNumber, email } }),
  myOrders: () =>
    api.get<Order[]>("/api/orders/my-orders"),
  detail: (id: number) =>
    api.get<Order>(`/api/orders/${id}`),
};

// ── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  validateCoupon: (code: string, subtotal: number) =>
    api.post<PromoCode>("/api/cart/validate-coupon", { code, subtotal }),
};

// ── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistApi = {
  get: () => api.get<ProductListItem[]>("/api/wishlist"),
  add: (product_id: number) => api.post("/api/wishlist", { product_id }),
  remove: (product_id: number) => api.delete(`/api/wishlist/${product_id}`),
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const reviewsApi = {
  forProduct: (productId: number, page = 1, perPage = 10) =>
    api.get(`/api/reviews/product/${productId}`, { params: { page, per_page: perPage } }),
  create: (data: unknown) =>
    api.post("/api/reviews", data),
  featured: () =>
    api.get("/api/reviews/featured"),
};

// ── Blogs ─────────────────────────────────────────────────────────────────────

export const blogsApi = {
  list: (params?: { category?: string; page?: number }) =>
    api.get<PaginatedResponse<Blog>>("/api/blogs", { params }),
  detail: (slug: string) =>
    api.get<Blog>(`/api/blogs/${slug}`),
};

// ── FAQs ─────────────────────────────────────────────────────────────────────

export const faqsApi = {
  list: (category?: string) =>
    api.get<FAQ[]>("/api/faqs", { params: category ? { category } : undefined }),
};

// ── Lens Collection ───────────────────────────────────────────────────────────

export const lensCollectionApi = {
  list: () => api.get<LensCollection[]>("/api/lens-collection"),
  detail: (slug: string) =>
    api.get<LensCollection & { products: ProductListItem[] }>(`/api/lens-collection/${slug}`),
};

// ── Upload ────────────────────────────────────────────────────────────────────

export const uploadApi = {
  prescription: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<{ url: string; public_id: string }>("/api/upload/prescription", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Dashboard
  stats: () => api.get("/api/admin/stats"),
  dashboard: {
    stats: () => api.get("/api/admin/stats"),
    recentOrders: () => api.get("/api/admin/recent-orders"),
    pendingReviews: () => api.get("/api/admin/pending-reviews"),
    lowStock: () => api.get("/api/admin/low-stock"),
  },

  // Products
  products: {
    list: (params?: Record<string, string | number | undefined>) =>
      api.get<PaginatedResponse<ProductListItem>>("/api/admin/products", { params }),
    detail: (id: number) => api.get(`/api/admin/products/${id}`),
    create: (data: unknown) => api.post<{ id: number; slug: string }>("/api/admin/products", data),
    update: (id: number, data: unknown) => api.patch(`/api/admin/products/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/products/${id}`),
    uploadImage: (productId: number, file: File, variantId?: number) => {
      const form = new FormData();
      form.append("file", file);
      const params = variantId ? `?variant_id=${variantId}` : "";
      return api.post<{ id: number; url: string }>(`/api/admin/products/${productId}/images${params}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    deleteImage: (imageId: number) => api.delete(`/api/admin/products/images/${imageId}`),
    assignLensOptions: (productId: number, lensOptionIds: number[]) =>
      api.put(`/api/admin/products/${productId}/lens-options`, { lens_option_ids: lensOptionIds }),
  },

  // Variants
  variants: {
    create: (productId: number, data: unknown) =>
      api.post(`/api/admin/products/${productId}/variants`, data),
    update: (variantId: number, data: unknown) =>
      api.patch(`/api/admin/products/variants/${variantId}`, data),
    delete: (variantId: number) =>
      api.delete(`/api/admin/products/variants/${variantId}`),
  },

  // Lens options
  lensOptions: {
    list: () => api.get("/api/admin/lens-options"),
    create: (data: unknown) => api.post("/api/admin/lens-options", data),
    update: (id: number, data: unknown) => api.patch(`/api/admin/lens-options/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/lens-options/${id}`),
  },

  // Lens collections
  lensCollections: {
    list: () => api.get("/api/admin/lens-collections"),
    create: (data: unknown) => api.post("/api/admin/lens-collections", data),
    update: (id: number, data: unknown) => api.patch(`/api/admin/lens-collections/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/lens-collections/${id}`),
  },

  // Orders
  orders: {
    list: (params?: Record<string, string | number | undefined>) =>
      api.get("/api/admin/orders", { params }),
    detail: (id: number) => api.get(`/api/admin/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      api.put(`/api/admin/orders/${id}/status`, { status }),
    updateTracking: (id: number, tracking_number: string) =>
      api.put(`/api/admin/orders/${id}/tracking`, { tracking_number }),
  },

  // Reviews
  reviews: {
    list: (params?: Record<string, string | number | undefined>) =>
      api.get<PaginatedResponse<Review>>("/api/admin/reviews", { params }),
    approve: (id: number) => api.put(`/api/admin/reviews/${id}/approve`),
    reject: (id: number) => api.put(`/api/admin/reviews/${id}/reject`),
    feature: (id: number) => api.put(`/api/admin/reviews/${id}/feature`),
    delete: (id: number) => api.delete(`/api/admin/reviews/${id}`),
  },

  // Blogs
  blogs: {
    list: (params?: Record<string, string | number | undefined>) =>
      api.get("/api/admin/blogs", { params }),
    detail: (id: number) => api.get(`/api/admin/blogs/${id}`),
    create: (data: unknown) => api.post<{ id: number; slug: string }>("/api/admin/blogs", data),
    update: (id: number, data: unknown) => api.patch(`/api/admin/blogs/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/blogs/${id}`),
    publish: (id: number) => api.post(`/api/admin/blogs/${id}/publish`),
    unpublish: (id: number) => api.post(`/api/admin/blogs/${id}/unpublish`),
    uploadCover: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post<{ url: string }>("/api/admin/blogs/upload-cover", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },

  // FAQs
  faqs: {
    list: () => api.get<FAQ[]>("/api/admin/faqs"),
    create: (data: unknown) => api.post<FAQ>("/api/admin/faqs", data),
    update: (id: number, data: unknown) => api.patch<FAQ>(`/api/admin/faqs/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/faqs/${id}`),
  },

  // Promo codes
  promoCodes: {
    list: () => api.get<PromoCode[]>("/api/admin/promo-codes"),
    create: (data: unknown) => api.post<PromoCode>("/api/admin/promo-codes", data),
    update: (id: number, data: unknown) => api.patch<PromoCode>(`/api/admin/promo-codes/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/promo-codes/${id}`),
  },

  // Users
  users: {
    list: (params?: Record<string, string | number | undefined>) =>
      api.get<PaginatedResponse<User>>("/api/admin/users", { params }),
    detail: (id: number) => api.get<User>(`/api/admin/users/${id}`),
    updateStatus: (id: number, is_active: boolean) =>
      api.patch(`/api/admin/users/${id}`, { is_active }),
  },
};

export default api;
