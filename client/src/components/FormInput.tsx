import { type FC } from 'react';
import clsx from 'clsx';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
}

const FormInput: FC<FormInputProps> = ({ label, id, type, register, error, placeholder }) => {
  const inputClassName = clsx(
    'mt-1 block w-full rounded-lg border bg-background dark:bg-background-dark text-text dark:text-text-dark px-4 py-2 text-md shadow-md transition-colors duration-300 ease-in-out',
    {
      'border-red-500': error,
      'border-gray-300': !error,
      'placeholder-gray-400 dark:placeholder-gray-600': true,
      'focus:outline-none focus:ring-2': true,
      'focus:ring-red-500 focus:border-red-500': error,
      'focus:ring-primary focus:border-primary': !error,
      'hover:border-primary-dark': true,
    }
  );

  return (
    <div className="mb-6 min-w-[66vw] md:min-w-[300px] ">
      <label htmlFor={id} className="block text-sm font-medium text-text dark:text-text-dark mb-1">
        {label}
      </label>
      <input
        {...register(id)}
        type={type}
        id={id}
        placeholder={placeholder}
        className={inputClassName}
      />
      <div className="mt-1 h-5">
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};

export default FormInput;
