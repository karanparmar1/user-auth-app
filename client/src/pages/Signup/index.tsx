import Layout from '@/components/Layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import AlertNotification from '../../components/AlertNotification';
import { useAuth } from '../../contexts/AuthContext';
import { SignupCredentials } from '../../types';
import { APP_ROUTES, REGEX } from '../../utils/constants';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { AxiosError } from 'axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address').regex(REGEX.EMAIL, 'Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      REGEX.PASSWORD,
      'Password must contain at least one letter, one number, and one special character'
    ),
});

const Signup: FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupCredentials>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupCredentials) => {
    try {
      await signup(data);
      setTimeout(() => {
        navigate(APP_ROUTES.HOME);
      }, 500);
    } catch (error: unknown) {
      console.error({ error });
      setError((error as AxiosError)?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Name"
          id="name"
          type="name"
          register={register}
          error={errors.name}
          placeholder="Enter your Name"
        />

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
        <Button label="Sign Up" type="submit" theme="secondary" />
      </form>

      <div className="my-3">
        {error && <AlertNotification message={error} type="error" onClose={() => setError(null)} />}
      </div>
    </Layout>
  );
};

export default Signup;
