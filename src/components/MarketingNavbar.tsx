import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button.js';
import ThemeToggle from './ThemeToggle.js';
import logoImage from '../assets/logo-new.png';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

const MarketingNavbar: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();

    // Use state-less media query approach where possible, but for tight space we'll use conditional styles
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'var(--bg-glass)',
            borderBottom: '1px solid var(--border-glass)',
            padding: '1rem 0',
            transition: 'var(--theme-transition)',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div className="container mx-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img
                        src={logoImage}
                        alt="Mathinova"
                        className="logo-img transition-all"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => navigate('/discovery')}
                        className="bg-transparent border-none cursor-pointer text-text-secondary hover:text-brand-primary transition-colors font-medium text-sm"
                    >
                        Courses
                    </button>
                    <button
                        onClick={() => scrollToSection('how-it-works')}
                        className="bg-transparent border-none cursor-pointer text-text-secondary hover:text-brand-primary transition-colors font-medium text-sm"
                    >
                        How It Works
                    </button>
                    <button
                        onClick={() => scrollToSection('free-content')}
                        className="bg-transparent border-none cursor-pointer text-text-secondary hover:text-brand-primary transition-colors font-medium text-sm"
                    >
                        Free Content
                    </button>
                    <button
                        onClick={() => navigate('/blog')}
                        className="bg-transparent border-none cursor-pointer text-text-secondary hover:text-brand-primary transition-colors font-medium text-sm"
                    >
                        Blog
                    </button>
                </div>

                {/* DESIGN LOCK: Consistent 4px gap between navigation elements */}
                <div
                    className="flex items-center"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: typeof window !== 'undefined' && window.innerWidth < 400 ? '2px' : '4px',
                        flexShrink: 1
                    }}
                >
                    <ThemeToggle />

                    {user ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                        >
                            Go to Dashboard
                        </Button>
                    ) : (
                        <>
                            <Link to="/login" style={{ display: 'flex', textDecoration: 'none' }}>
                                <Button variant="ghost" size="sm" className="px-1.5 md:px-4">Log In</Button>
                            </Link>
                            <Link to="/register" style={{ display: 'flex', textDecoration: 'none' }}>
                                <Button size="sm" className="px-2 md:px-6">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MarketingNavbar;
