
import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { SwotAnalysis } from './components/SwotAnalysis';
import { type User } from './lib/api';

/**
 * Main App component that handles authentication flow and routing
 * Shows AuthForm for unauthenticated users, SwotAnalysis for authenticated users
 */
function App() {
  // State to store the current authenticated user data
  const [user, setUser] = useState<User | null>(null);
  // State to store the authentication token
  const [token, setToken] = useState<string | null>(null);

  /**
   * Effect to check for existing authentication on app load
   * Restores user session from localStorage if valid data exists
   */
  useEffect(() => {
    // Retrieve saved authentication data from localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // If both token and user data exist, attempt to restore session
    if (savedToken && savedUser) {
      try {
        // Parse the stored user data from JSON
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        // If parsing fails, clear corrupted data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []); // Empty dependency array - runs only once on component mount

  /**
   * Handles successful authentication from AuthForm
   * Updates state and persists data to localStorage
   */
  const handleAuthSuccess = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    // Note: localStorage persistence should be handled in the auth logic
  };

  /**
   * Handles user logout
   * Clears authentication state and localStorage
   */
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    // Clear authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Render AuthForm if user is not authenticated
  if (!user || !token) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  // Render main SWOT Analysis app if user is authenticated
  return <SwotAnalysis user={user} onLogout={handleLogout} />;
}

export default App;
