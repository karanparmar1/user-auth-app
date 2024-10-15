import { type FC } from 'react';

interface AlertNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const AlertNotification: FC<AlertNotificationProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  }[type];

  const icons = {
    success: '✔️',
    error: '❗',
    info: 'ℹ️',
  }[type];

  return (
    <div
      className={`relative border-l-4 p-4 ${bgColor} transition-transform duration-300 transform`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="text-xl mr-2">{icons}</span>
        <div>
          <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p>{message}</p>
        </div>
      </div>

      <button
        className="absolute top-0 right-0 px-4 py-3 text-lg focus:outline-none hover:text-gray-600"
        onClick={onClose}
        aria-label="Close alert"
      >
        <svg
          className="fill-current h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </button>
    </div>
  );
};

export default AlertNotification;
