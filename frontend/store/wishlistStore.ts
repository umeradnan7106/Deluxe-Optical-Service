import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wishlistApi } from "@/lib/api";

interface WishlistState {
  ids: number[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (id: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
  toggle: (id: number, isAuth: boolean) => Promise<boolean>;
  has: (id: number) => boolean;
  clear: () => void;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      loaded: false,

      load: async () => {
        try {
          const { data } = await wishlistApi.get();
          set({ ids: data.map((p) => p.id), loaded: true });
        } catch {
          set({ loaded: true });
        }
      },

      add: async (id) => {
        set((s) => ({ ids: [...s.ids, id] }));
        try {
          await wishlistApi.add(id);
        } catch {
          set((s) => ({ ids: s.ids.filter((i) => i !== id) }));
        }
      },

      remove: async (id) => {
        set((s) => ({ ids: s.ids.filter((i) => i !== id) }));
        try {
          await wishlistApi.remove(id);
        } catch {
          set((s) => ({ ids: [...s.ids, id] }));
        }
      },

      toggle: async (id, isAuth) => {
        if (!isAuth) return false;
        const already = get().ids.includes(id);
        if (already) {
          await get().remove(id);
        } else {
          await get().add(id);
        }
        return !already;
      },

      has: (id) => get().ids.includes(id),

      clear: () => set({ ids: [], loaded: false }),
    }),
    { name: "wishlist-storage" }
  )
);

export default useWishlistStore;
