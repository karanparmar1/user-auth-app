import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import FormInput from '@/components/FormInput';
import AlertNotification from '@/components/AlertNotification';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import { APP_ROUTES } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { AxiosError } from 'axios';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const Login: FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      setTimeout(() => {
        navigate(APP_ROUTES.HOME);
      }, 500);
    } catch (error: unknown) {
      console.error({ error });
      setError((error as AxiosError)?.message || 'Invalid email or password');
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-5">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          id="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="Enter your email"
        />

        <FormInput
          label="Password"
          id="password"
          type="password"
          register={register}
          error={errors.password}
          placeholder="Enter your password"
        />

        {/* {error && <p className="text-sm text-red-600">{error}</p>} */}

        <Button label="Login" type="submit" theme="primary" loading={isLoading} />
      </form>

      <div className="my-3">
        {error && <AlertNotification message={error} type="error" onClose={() => setError(null)} />}
      </div>
    </Layout>
  );
};

export default Login;
