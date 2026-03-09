import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
    options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    className = '',
    containerClassName = 'mb-6',
    ...props
}) => {
    return (
        <div className={`flex flex-col w-full animate-fade-in ${containerClassName}`}>
            {label && (
                <label className="text-sm font-bold text-text-primary mb-1 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    className={`w-full bg-white/10 border-2 border-border-glass rounded-lg px-5 py-4 text-text-primary focus:outline-none focus:border-primary-violet focus:shadow-lg focus:shadow-primary-violet/20 transition-all group-hover:border-border-glass-bright appearance-none cursor-pointer ${className}`}
                    style={{ lineHeight: 'var(--ui-line-height-standard)' }}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0f0f12] text-text-primary">
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Custom arrow for appearance-none */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-focus-within:text-primary-violet transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
                {/* Focus indicator glow line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary-violet transition-all duration-300 group-focus-within:w-full" />
            </div>
            {error && <span className="text-xs text-red-400 mt-2 ml-1 font-medium" style={{ lineHeight: 'var(--ui-line-height-standard)' }}>{error}</span>}
        </div>
    );
};

export default Select;
