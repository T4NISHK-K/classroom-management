import { create } from 'zustand';

interface AuthState {
  username?: string;
  role?: 'admin' | 'faculty';
  faculty_id?: number;
  faculty_name?: string;
  authenticated: boolean;
  setAuth: (auth: {
    username: string;
    role: 'admin' | 'faculty';
    faculty_id?: number;
    faculty_name?: string;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  setAuth: (auth) => {
    set({ ...auth, authenticated: true });
    // Also store in localStorage for persistence
    localStorage.setItem('auth', JSON.stringify({ ...auth, authenticated: true }));
  },
  clearAuth: () => {
    set({ authenticated: false, username: undefined, role: undefined });
    localStorage.removeItem('auth');
  },
}));

// Load auth from localStorage on initialization
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth');
  if (stored) {
    try {
      const auth = JSON.parse(stored);
      useAuthStore.setState(auth);
    } catch (e) {
      // Invalid stored auth, ignore
    }
  }
}
