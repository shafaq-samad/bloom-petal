import React, { createContext, useContext, useState, useEffect } from "react";

export interface RecipientProfile {
  name: string;
  address: string;
  deliveryNote?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  savedAddresses: string[];
  savedRecipients: RecipientProfile[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAddresses: (addresses: string[]) => Promise<boolean>;
  updateRecipients: (recipients: RecipientProfile[]) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("bloom_auth_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            savedAddresses: userData.savedAddresses || [],
            savedRecipients: userData.savedRecipients || []
          });
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("bloom_auth_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || "Invalid credentials" };
      }
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("bloom_auth_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || "Sign up failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("bloom_auth_token");
    setToken(null);
    setUser(null);
  };

  const updateAddresses = async (addresses: string[]) => {
    if (!token) return false;
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ savedAddresses: addresses })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? { ...prev, savedAddresses: data.savedAddresses } : null);
        return true;
      }
    } catch (err) {
      console.error("Failed to update addresses", err);
    }
    return false;
  };

  const updateRecipients = async (recipients: RecipientProfile[]) => {
    if (!token) return false;
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ savedRecipients: recipients })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? { ...prev, savedRecipients: data.savedRecipients } : null);
        return true;
      }
    } catch (err) {
      console.error("Failed to update recipients", err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateAddresses,
        updateRecipients
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
