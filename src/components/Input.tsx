import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', containerClassName = 'mb-6', ...props }) => {
    return (
        <div className={`flex flex-col w-full animate-fade-in ${containerClassName}`}>
            {label && (
                <label className="text-sm font-bold text-text-primary">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`w-full bg-surface-glass border-2 border-border-glass rounded-lg px-5 py-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-violet focus:shadow-lg focus:shadow-primary-violet/20 transition-all group-hover:border-border-glass-bright ${className}`}
                    style={{ lineHeight: 'var(--ui-line-height-standard)' }}
                    {...props}
                />
                {/* Focus indicator glow line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary-violet transition-all duration-300 group-focus-within:w-full" />
            </div>
            {error && <span className="text-xs text-red-400 mt-2 ml-1 font-medium" style={{ lineHeight: 'var(--ui-line-height-standard)' }}>{error}</span>}
        </div>
    );
};

export default Input;
