// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  loginUser,
  registerUser,
  fetchMe,
  type User,
} from "../services/auth";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore saved login
  useEffect(() => {
    // Prefer new keys, but also accept old ones if they exist
    const storedAccess =
      localStorage.getItem("access_token") ?? localStorage.getItem("access");
    const storedRefresh =
      localStorage.getItem("refresh_token") ?? localStorage.getItem("refresh");

    if (!storedAccess || !storedRefresh) {
      console.log("No stored tokens → user not logged in");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        console.log("Restoring session...");
        const me = await fetchMe(storedAccess);

        console.log("Session restored:", me);
        setUser(me);
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);

        // Normalize keys to the new names
        localStorage.setItem("access_token", storedAccess);
        localStorage.setItem("refresh_token", storedRefresh);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } catch (e) {
        console.warn("Token invalid → clearing storage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    console.log("LOGIN CALLED:", username);

    const { access, refresh } = await loginUser({ username, password });

    console.log("Login success → tokens received");

    // Save with names used by the rest of the app
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);



    setAccessToken(access);
    setRefreshToken(refresh);

    const me = await fetchMe(access);
    console.log("Fetched user:", me);

    setUser(me);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => {
    console.log("REGISTER CALLED:", username, email);

    await registerUser({ username, email, password, password2 });

    console.log("Register success → logging in automatically");

    await login(username, password);
  };

  const logout = () => {
    console.log("LOGOUT CALLED");

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
