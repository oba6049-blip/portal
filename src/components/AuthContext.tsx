import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  isSupabaseConfigured, 
  saveStudentProfile
} from '../supabase';

export interface StudentUser {
  uid: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: StudentUser | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signUpUser: (email: string, password: string, fullName: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  loginWithGoogleUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  useLocalAuthFallback: boolean;
  setUseLocalAuthFallback: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalAuthFallback, setUseLocalAuthFallbackState] = useState<boolean>(() => {
    if (isSupabaseConfigured) {
      localStorage.removeItem('textocode_auth_fallback');
      return false;
    }
    return true;
  });

  const setUseLocalAuthFallback = (val: boolean) => {
    setUseLocalAuthFallbackState(val);
    if (val) {
      localStorage.setItem('textocode_auth_fallback', 'true');
    } else {
      localStorage.removeItem('textocode_auth_fallback');
    }
  };

  const clearError = () => setError(null);

  // Initialize and track auth states
  useEffect(() => {
    // If fallback is explicitly enabled, load local user
    if (useLocalAuthFallback) {
      const loadedMockUser = localStorage.getItem('textocode_logged_in_student');
      if (loadedMockUser) {
        setUser(JSON.parse(loadedMockUser));
      }
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Get current session
      supabase.auth.getSession().then(({ data: { session }, error: sessionErr }) => {
        if (sessionErr) {
          console.warn("Error getting current session:", sessionErr.message);
        }
        if (session && session.user) {
          const userMeta = session.user.user_metadata || {};
          const fullName = userMeta.fullName || userMeta.full_name || userMeta.name || 'Textocode Student';
          setUser({
            uid: session.user.id,
            email: session.user.email || '',
            fullName: fullName
          });
          // Cache/sync to students profile table
          saveStudentProfile(session.user.id, fullName, session.user.email || '');
        } else {
          setUser(null);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Session fallback load error", err);
        setLoading(false);
      });

      // 2. Listen to Auth State Events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setLoading(true);
        if (session && session.user) {
          const userMeta = session.user.user_metadata || {};
          const fullName = userMeta.fullName || userMeta.full_name || userMeta.name || 'Textocode Student';
          setUser({
            uid: session.user.id,
            email: session.user.email || '',
            fullName: fullName
          });
          // Cache/sync to profile
          saveStudentProfile(session.user.id, fullName, session.user.email || '');
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      // Offline / Local sandbox simulation support
      const loadedMockUser = localStorage.getItem('textocode_logged_in_student');
      if (loadedMockUser) {
        setUser(JSON.parse(loadedMockUser));
      }
      setLoading(false);
    }
  }, [useLocalAuthFallback]);

  // 1. Sign Up
  const signUpUser = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    try {
      if (isSupabaseConfigured && supabase && !useLocalAuthFallback) {
        // Supabase user signup with metadata object
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              fullName: fullName,
              full_name: fullName
            }
          }
        });

        if (signUpErr) throw signUpErr;

        if (data.user) {
          // Sync profile to database
          await saveStudentProfile(data.user.id, fullName, cleanEmail);

          // If session is null (which happens when email confirm is enabled in Supabase portal config)
          if (!data.session) {
            setError('✉️ Account created! Please check your email to confirm registration or sign in, or enable mock mode if testing off-grid!');
          }

          setUser({
            uid: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: fullName
          });
        }
      } else {
        // Mock DB Signup
        const mockUid = `mock-${Date.now()}`;
        const mockUser: StudentUser = { uid: mockUid, email: cleanEmail, fullName };

        const localStudents = JSON.parse(localStorage.getItem('textocode_students_auth') || '[]');
        if (localStudents.some((u: any) => u.email.trim().toLowerCase() === cleanEmail)) {
          throw new Error('An account with this email already exists.');
        }
        localStudents.push({ uid: mockUid, email: cleanEmail, password: cleanPassword, fullName });
        localStorage.setItem('textocode_students_auth', JSON.stringify(localStudents));

        // Match profile list
        await saveStudentProfile(mockUid, fullName, cleanEmail);
        localStorage.setItem('textocode_logged_in_student', JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } catch (err: any) {
      console.error(err);

      // Handle common Supabase or connection failures
      let errMsg = err?.message || 'Failed to create student account.';
      if (errMsg.toLowerCase().includes('already registered') || err?.code === 'user_already_exists') {
        errMsg = 'This email is already registered by another student.';
      } else if (errMsg.includes('at least 6 characters')) {
        errMsg = 'The password must be at least 6 characters.';
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Login
  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const isMasterAdmin = (cleanEmail === 'nuddywale@gmail.com' || cleanEmail === 'oba6049@gmail.com') && cleanPassword === 'subair009';

    try {
      if (isSupabaseConfigured && supabase && !useLocalAuthFallback) {
        try {
          // Supabase sign-in (try first so they get a valid session for RLS)
          const { data, error: signInErr } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword
          });

          if (signInErr) {
            // If it's the master admin, we can swallow the error and fall back to local override
            if (isMasterAdmin) {
              console.warn("Supabase master admin sign-in failed, falling back to local override:", signInErr.message);
            } else {
              throw signInErr;
            }
          } else if (data.user) {
            const userMeta = data.user.user_metadata || {};
            const fullName = userMeta.fullName || userMeta.full_name || userMeta.name || 'System Admin (Nuddywale)';

            setUser({
              uid: data.user.id,
              email: data.user.email || cleanEmail,
              fullName: fullName
            });
            return;
          }
        } catch (supErr) {
          if (!isMasterAdmin) {
            throw supErr;
          }
        }
      }

      if (isMasterAdmin) {
        // Master admin override: log in immediately as fallback
        const adminUser: StudentUser = {
          uid: 'master-admin-uid-999',
          email: cleanEmail,
          fullName: cleanEmail === 'oba6049@gmail.com' ? 'System Admin (Oba)' : 'System Admin (Nuddywale)'
        };
        localStorage.setItem('textocode_logged_in_student', JSON.stringify(adminUser));
        setUser(adminUser);
        return;
      }

      if (isSupabaseConfigured && supabase && !useLocalAuthFallback) {
        // This block is already fully handled above, keeping structure intact or bypassing
      } else {
        // Mock DB Login
        const localStudents = JSON.parse(localStorage.getItem('textocode_students_auth') || '[]');
        const matched = localStudents.find((u: any) => u.email.trim().toLowerCase() === cleanEmail && u.password.trim() === cleanPassword);

        if (!matched) {
          throw new Error('Invalid email or password credential.');
        }

        const mockUser: StudentUser = { uid: matched.uid, email: cleanEmail, fullName: matched.fullName };
        localStorage.setItem('textocode_logged_in_student', JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } catch (err: any) {
      console.error(err);

      let errMsg = err?.message || 'Failed to sign in.';
      if (errMsg.toLowerCase().includes('invalid login credentials') || err?.code === 'invalid_credentials') {
        errMsg = 'Incorrect email/password or account does not exist.';
      } else if (errMsg.toLowerCase().includes('email not confirmed')) {
        errMsg = 'Please verify your email address to continue logging in.';
      }

      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Login with Google (OAuth)
  const loginWithGoogleUser = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error: oAuthErr } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (oAuthErr) throw oAuthErr;
      } else {
        // Mock Sandbox login with Google
        const mockUid = `google-mock-${Date.now()}`;
        const mockUser: StudentUser = { 
          uid: mockUid, 
          email: 'google.student@example.com', 
          fullName: 'Google Demo Student' 
        };

        await saveStudentProfile(mockUid, mockUser.fullName, mockUser.email);
        localStorage.setItem('textocode_logged_in_student', JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err?.message || 'Google Authentication cancelled.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Logout
  const logoutUser = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && !useLocalAuthFallback) {
        const { error: logOutErr } = await supabase.auth.signOut();
        if (logOutErr) console.warn("Supabase log out warn:", logOutErr.message);
      } else {
        localStorage.removeItem('textocode_logged_in_student');
      }
      setUser(null);
    } catch (err) {
      console.error("Logout encounter error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      clearError, 
      signUpUser, 
      loginUser, 
      loginWithGoogleUser, 
      logoutUser,
      useLocalAuthFallback,
      setUseLocalAuthFallback
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
