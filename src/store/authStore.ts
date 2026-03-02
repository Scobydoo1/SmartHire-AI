import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// Define the User type based on your schema
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "recruiter" | "candidate";
  // Add other fields as needed
}

// Define the Auth State
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create the store with persist and devtools middlewares
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        login: (user, token) =>
          set(
            {
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            "auth/login",
          ),

        logout: () =>
          set(
            {
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "auth/logout",
          ),

        updateUser: (updatedUser) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updatedUser } : null,
            }),
            false,
            "auth/updateUser",
          ),

        setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),
      }),
      {
        name: "auth-storage", // name of the item in the storage (must be unique)
        // You can customize storage here. Default is localStorage
        // getStorage: () => sessionStorage,

        // Optional: Filter what gets persisted
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          // We don't persist isLoading
        }),
      },
    ),
    { name: "AuthStore" }, // Name for Redux DevTools
  ),
);
