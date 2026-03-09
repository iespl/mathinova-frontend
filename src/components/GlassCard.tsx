import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    noHover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style, onClick, noHover }) => {
    return (
        <div
            className={`glass-panel animate-fade-in ${noHover ? '' : 'hover-glow'} ${className}`}
            style={{
                backgroundColor: 'var(--bg-glass-card)',
                cursor: onClick ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                ...style
            }}
            onClick={onClick}

        // Hover effects moved to CSS for better performance and consistency
        >
            {/* Sublte inner glow */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                pointerEvents: 'none'
            }} />

            {children}
        </div>
    );
};

export default GlassCard;
