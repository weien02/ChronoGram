import { create } from "zustand";

export interface AuthState {
	user: object | null;
	signin: (user: object) => void;
	signout: () => void;
	setUser: (user: object) => void;
  }

const useAuthState = create<AuthState>((set) => ({
	user: JSON.parse(localStorage.getItem("user-doc")),
	signin: (user) => set({ user }),
	signout: () => set({ user: null }),
	setUser: (user) => set({ user }),
}));

export default useAuthState;