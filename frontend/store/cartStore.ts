import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { calculateShipping, calculatePaymentDiscount } from "@/lib/utils";

interface CartState {
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

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      paymentMethod: "cod",
      couponCode: null,
      couponDiscount: 0,

      addItem: (incoming) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === incoming.product_id && i.variant_id === incoming.variant_id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === incoming.product_id && i.variant_id === incoming.variant_id
                  ? { ...i, quantity: i.quantity + incoming.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, incoming] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === productId && i.variant_id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId && i.variant_id === variantId
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      clearCart: () =>
        set({ items: [], couponCode: null, couponDiscount: 0, paymentMethod: "cod" }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const price = item.sale_price ?? item.base_price;
          return sum + (price + item.lens_options_price) * item.quantity;
        }, 0);
      },

      getShippingFee: () => calculateShipping(get().getSubtotal()),

      getPaymentDiscount: () =>
        calculatePaymentDiscount(get().getSubtotal(), get().paymentMethod),

      getTotal: () => {
        const { couponDiscount } = get();
        return (
          get().getSubtotal() +
          get().getShippingFee() -
          get().getPaymentDiscount() -
          couponDiscount
        );
      },
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;
