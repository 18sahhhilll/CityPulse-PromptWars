import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const LOCAL_STORAGE_USER_KEY = 'citypulse_user_session';

const loadLocalSession = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.error('Error loading local session:', err);
  }
  return null;
};

export const useAuthStore = create((set, get) => ({
  user: loadLocalSession(),
  session: null,
  loading: isSupabaseConfigured,
  error: null,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      set({ loading: false });
      return;
    }

    try {
      set({ loading: true });
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const full_name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        const userObj = {
          id: session.user.id,
          email: session.user.email,
          fullName: full_name,
          createdAt: session.user.created_at || new Date().toISOString(),
          isSupabase: true,
        };
        set({ user: userObj, session, loading: false });
      } else {
        set({ loading: false });
      }

      supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (currentSession?.user) {
          const full_name = currentSession.user.user_metadata?.full_name || currentSession.user.email.split('@')[0];
          const userObj = {
            id: currentSession.user.id,
            email: currentSession.user.email,
            fullName: full_name,
            createdAt: currentSession.user.created_at || new Date().toISOString(),
            isSupabase: true,
          };
          set({ user: userObj, session: currentSession });
        } else {
          set({ user: get().user?.isSupabase ? null : get().user, session: null });
        }
      });
    } catch (err) {
      console.warn('Supabase auth initialization fallback:', err);
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }
      const full_name = data.user?.user_metadata?.full_name || email.split('@')[0];
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        fullName: full_name,
        createdAt: data.user.created_at || new Date().toISOString(),
        isSupabase: true,
      };
      set({ user: userObj, session: data.session, loading: false });
      return { success: true };
    }

    // Offline / Local Session Handler
    const fullName = email.split('@')[0].replace('.', ' ');
    const formattedName = fullName.charAt(0).toUpperCase() + fullName.slice(1);
    const localUser = {
      id: `usr-${Date.now()}`,
      email,
      fullName: formattedName,
      createdAt: new Date().toISOString(),
      isSupabase: false,
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
    set({ user: localUser, loading: false });
    return { success: true };
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }
      const userObj = {
        id: data.user?.id || `usr-${Date.now()}`,
        email,
        fullName: fullName || email.split('@')[0],
        createdAt: new Date().toISOString(),
        isSupabase: true,
      };
      set({ user: userObj, session: data.session, loading: false });
      return { success: true };
    }

    // Offline / Local Registration Handler
    const localUser = {
      id: `usr-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      createdAt: new Date().toISOString(),
      isSupabase: false,
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
    set({ user: localUser, loading: false });
    return { success: true };
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    set({ user: null, session: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
