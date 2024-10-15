import type { FC, ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-text dark:text-text-dark">
        {children}
      </main>

      <footer className="bg-white dark:bg-background-dark shadow-lg py-4 text-center text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} My Application. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
