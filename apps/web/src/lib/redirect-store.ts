import { create } from "zustand";

interface RedirectStore {
  next: string | null;
  setNext: (path: string | null) => void;
  consumeNext: () => string | null;
}

export const useRedirectStore = create<RedirectStore>((set, get) => ({
  next: null,
  setNext: (path) => set({ next: path }),
  consumeNext: () => {
    const { next } = get();
    set({ next: null });
    return next;
  },
}));
