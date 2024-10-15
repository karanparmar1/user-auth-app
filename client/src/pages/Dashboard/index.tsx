import { FC, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { User } from '@/types';
import api from '@/utils/api';
import { API_ROUTES } from '@/utils/constants';

const Dashboard: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>(API_ROUTES.ALL_USERS);
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          <ul className="divide-y divide-gray-200">
            {users?.map((user) => (
              <li key={user._id} className="py-4">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
