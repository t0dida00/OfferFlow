/**
 * Custom hook for LoginPage business logic
 */

import { useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BACKEND_GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

export const useLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const loginWithGoogle = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = BACKEND_GOOGLE_AUTH_URL;
  };

  return {
    isSignUp,
    setIsSignUp,
    loginWithGoogle,
  };
};

