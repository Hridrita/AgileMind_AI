'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Auth context create করতে পারেন চাইলে
  return (
    <>
      {children}
    </>
  );
}