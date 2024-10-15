import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../utils/constants';

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for does not exist.</p>

      <Link
        to={APP_ROUTES.HOME}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
