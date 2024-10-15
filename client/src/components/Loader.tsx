import { type FC } from 'react';

const Loader: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-opacity-60 bg-transparent"></div>
    </div>
  );
};

export default Loader;
