import { create } from "zustand";

interface RedirectStore {
  /** Path the user was heading to before being bounced to /login. */
  next: string | null;
  setNext: (path: string | null) => void;
  /** Read the pending path and clear it in one call. */
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
