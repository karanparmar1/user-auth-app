import { FC } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  theme?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  asLink?: boolean;
  to?: string;
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  theme = 'primary',
  loading = false,
  disabled = false,
  asLink = false,
  to = '#',
}) => {
  const baseClass =
    'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-300 ease-in-out shadow-md';

  const themeClass = clsx({
    'bg-primary dark:bg-primary-dark text-text hover:bg-primary-dark dark:hover:bg-primary':
      theme === 'primary',
    'bg-secondary  dark:bg-secondary-dark text-buttonText hover:bg-secondary-dark dark:hover:bg-secondary':
      theme === 'secondary',
  });

  const disabledClass = disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';
  const loadingClass = loading ? 'animate-spin mr-2' : '';

  const content = (
    <span className="flex items-center">
      {loading && (
        <svg
          className={`h-5 w-5 text-white ${loadingClass}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2v4m0 12v4m8.485-8.485h-4m-12 0H2m2.93-4.07l2.83 2.83m0-2.83L4.93 15.07"
          />
        </svg>
      )}
      {label}
    </span>
  );

  if (asLink && to) {
    return (
      <Link to={to} className={clsx(baseClass, themeClass, disabledClass)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(baseClass, themeClass, disabledClass)}
    >
      {content}
    </button>
  );
};

export default Button;
