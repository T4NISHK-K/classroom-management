import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage first
        const stored = localStorage.getItem('auth');
        if (stored) {
          try {
            const authData = JSON.parse(stored);
            if (authData.authenticated) {
              // Verify with server
              const response = await api.auth.check();
              if (response.success && response.data?.authenticated) {
                auth.setAuth(response.data);
                setIsLoading(false);
                return;
              }
            }
          } catch (e) {
            // Invalid stored auth
          }
        }

        // Check with server
        const response = await api.auth.check();
        if (response.success && response.data?.authenticated) {
          auth.setAuth(response.data);
          setIsLoading(false);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [auth, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!auth.authenticated) {
    return null;
  }

  return <>{children}</>;
}

