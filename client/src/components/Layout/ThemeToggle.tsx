import { FC, useEffect, useState } from 'react';

const ThemeToggle: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Get the theme from localStorage or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || !savedTheme; // Default to dark if no value exists
  });

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark', newTheme === 'dark');
    setIsDarkMode((mode) => !mode);
    localStorage.setItem('theme', newTheme); // Store the new theme in localStorage
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <label role="button" className="flex items-center mx-2">
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-10 h-5 cursor-pointer relative"
        aria-label="Toggle dark mode"
      >
        <div className="relative w-full h-full bg-gray-300 rounded-full transition-colors duration-300">
          <div
            className={`absolute flex justify-center items-center w-8 h-8 -top-1.5 bg-white rounded-full shadow transition-transform duration-300 transform ${
              isDarkMode ? 'translate-x-5 bg-cyan-500' : '-translate-x-2'
            }`}
          >
            <div className="relative text-md hover:animate-spin">{isDarkMode ? '🌙' : '☀️'}</div>
          </div>
        </div>
      </button>
    </label>
  );
};

export default ThemeToggle;
