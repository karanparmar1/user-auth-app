import { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useAuth } from '@/contexts/AuthContext';
import { fetchCsrfToken } from '@/utils/api';
import { APP_ROUTES } from '@/utils/constants';

import Loader from '@/components/Loader';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Signup from '@/pages/Signup';

const App: FC = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!Cookies.get('XSRF-TOKEN')) {
      fetchCsrfToken();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path={APP_ROUTES.HOME}
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path={APP_ROUTES.LOGIN} element={<Login />} />

      <Route path={APP_ROUTES.SIGNUP} element={<Signup />} />

      <Route
        path={APP_ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
