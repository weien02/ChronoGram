import { create } from "zustand";

const useAuthState = create((set) => ({
	user: JSON.parse(localStorage.getItem("user-doc")),
	signin: (user) => set({ user }),
	signout: () => set({ user: null }),
	setUser: (user) => set({ user }),
}));

export default useAuthState;