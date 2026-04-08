/**
 * Custom hook for LoginSuccess business logic
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useLoginSuccess = (onLogin: (token: string) => Promise<void>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const token = searchParams.get('token');

      if (token) {
        await onLogin(token);
        navigate('/dashboard');
      } else {
        console.error("Missing token in URL params");
        navigate('/');
      }
    };

    authenticate();
  }, [searchParams, navigate, onLogin]);
};

