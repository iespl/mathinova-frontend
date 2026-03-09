import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50
                ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200 border border-slate-300'}
            `}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-full h-full flex items-center justify-between px-1">
                {/* Moon Icon (Visible in Dark Mode) */}
                <Moon
                    className={`
                        w-3.5 h-3.5 text-brand-primary transition-all duration-300 transform
                        ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                    `}
                />

                {/* Sun Icon (Visible in Light Mode) */}
                <Sun
                    className={`
                        w-3.5 h-3.5 text-yellow-500 transition-all duration-300 transform
                        ${isDark ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
                    `}
                />
            </div>

            {/* Sliding Thumb */}
            <div
                className={`
                    absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 transform flex items-center justify-center
                    ${isDark ? 'translate-x-6' : 'translate-x-0'}
                `}
            >
                {/* Optional: Tiny dot or icon on thumb? For now, clean white thumb is best for "Professional" look */}
            </div>
        </button>
    );
};

export default ThemeToggle;
