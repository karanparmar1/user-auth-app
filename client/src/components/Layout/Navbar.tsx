import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { APP_ROUTES } from '@/utils/constants';
import ThemeToggle from './ThemeToggle';

const Navbar: FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-background dark:bg-background-dark shadow-lg py-3">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          to={APP_ROUTES.HOME}
          className="text-lg font-bold text-primary hover:text-primary-dark"
        >
          HOME
        </Link>

        <div className="flex flex-col min-[480px]:flex-row items-center space-x-4 gap-y-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to={APP_ROUTES.PROFILE}
                className="text-text dark:text-text-dark hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <Link
                to={APP_ROUTES.DASHBOARD}
                className="text-text dark:text-text-dark hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Button label="Logout" onClick={logout} theme="secondary" />
            </>
          ) : (
            <>
              <Button asLink to={APP_ROUTES.LOGIN} label="Login" theme="primary" />
              <Button asLink to={APP_ROUTES.SIGNUP} label="Sign Up" theme="secondary" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
