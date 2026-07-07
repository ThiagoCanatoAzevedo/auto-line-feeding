import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-brand-dark dark:text-brand-light" />
      ) : (
        <Sun className="w-5 h-5 text-brand-light" />
      )}
    </button>
  );
};
