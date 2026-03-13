import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    style,
    ...props
}) => {
    const sizeStyles = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
    };

    const variants = {
        primary: {
            background: 'var(--accent-gradient)',
            color: '#fff',
            boxShadow: '0 4px 15px 0 var(--primary-violet-glow)',
            border: 'none',
        },
        secondary: {
            background: 'var(--primary-cyan)',
            color: '#fff',
            boxShadow: '0 4px 15px 0 var(--primary-cyan-glow)',
            border: 'none',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'none',
        },
        outline: {
            background: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--primary-violet)',
            boxShadow: 'none',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-primary)',
            border: 'none',
            boxShadow: 'none',
        }
    };

    const currentVariant = variants[variant as keyof typeof variants] || variants.primary;

    return (
        <button
            className={`font-heading font-bold animate-fade-in ${sizeStyles[size]} ${className}`}
            disabled={isLoading || props.disabled}
            style={{
                ...currentVariant,
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 1,
                padding: size === 'lg' ? '1rem var(--btn-px-lg, 2.25rem)' : (size === 'md' ? '0.75rem var(--btn-px-md, 1.75rem)' : '0.65rem var(--btn-px-sm, 1.25rem)'),
                minHeight: size === 'sm' ? 'var(--ui-min-interactive-height)' : 'var(--ui-input-min-height)',
                minWidth: (typeof window !== 'undefined' && window.innerWidth < 640) ? '0px' : (size === 'lg' ? '180px' : (size === 'md' ? '140px' : 'auto')),
                whiteSpace: 'nowrap',
                transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: (isLoading || props.disabled) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || props.disabled) ? 0.5 : 1,
                fontWeight: '600',
                letterSpacing: '0.01em',
                lineHeight: 'var(--ui-line-height-standard)',
                ...style
            }}
            onMouseEnter={(e) => {
                if (!isLoading && !props.disabled) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    if (variant === 'primary') {
                        e.currentTarget.style.boxShadow = '0 8px 25px 0 var(--primary-violet-glow)';
                    } else if (variant === 'secondary') {
                        e.currentTarget.style.boxShadow = '0 8px 25px 0 var(--primary-cyan-glow)';
                    } else if (variant === 'glass') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    } else if (variant === 'outline') {
                        e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                    } else if (variant === 'ghost') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                }
            }}
            onMouseLeave={(e) => {
                if (!isLoading && !props.disabled) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (variant === 'primary') {
                        e.currentTarget.style.boxShadow = '0 4px 15px 0 var(--primary-violet-glow)';
                    } else if (variant === 'secondary') {
                        e.currentTarget.style.boxShadow = '0 4px 15px 0 var(--primary-cyan-glow)';
                    } else if (variant === 'glass') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'var(--border-glass)';
                    } else if (variant === 'outline') {
                        e.currentTarget.style.background = 'transparent';
                    } else if (variant === 'ghost') {
                        e.currentTarget.style.background = 'transparent';
                    }
                }
            }}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <span className="animate-pulse">Processing...</span>
                </div>
            ) : children}
        </button>
    );
};

export default Button;
