import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    // Mock authentication - replace with your own backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const mockUser = {
            id: 'user1',
            email: email,
            displayName: email.split('@')[0]
          };
          setUser(mockUser);
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          resolve({ user: mockUser });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signUp = async (email, password, displayName) => {
    // Mock sign up - replace with your own backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const mockUser = {
            id: 'user1',
            email: email,
            displayName: displayName || email.split('@')[0]
          };
          setUser(mockUser);
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          resolve({ user: mockUser });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
