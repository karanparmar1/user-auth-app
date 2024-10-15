import { FC } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Home: FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to the Application
        </h1>
        {user && (
          <p className="mt-5 ml-1 text-xl text-gray-600">
            Hello, {user.name}!
            <br />
            You are logged in as a {user.role}.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Home;
