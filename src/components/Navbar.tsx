import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import logoImage from '../assets/logo-new.png';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Use state-less media query approach where possible, but for tight space we'll use conditional styles
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const handleLogout = () => {
        logout();
        navigate('/login');
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
            padding: '0.65rem 0',
            transition: 'var(--theme-transition)'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img
                        src={logoImage}
                        alt="Mathinova"
                        className="logo-img transition-all"
                    />
                </Link>

                {/* Actions */}
                {/* DESIGN LOCK: Consistent 4px gap between navigation elements */}
                <div
                    className="flex items-center"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0
                    }}
                >
                    <ThemeToggle />

                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }} className="hidden md:block hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-glass)' }} className="hidden md:block" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="hidden lg:block">{user.name}</span>
                                <Button variant="secondary" size="sm" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '12px', minHeight: '36px' }}>
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <>
                                <Link to="/login" style={{ display: 'flex', textDecoration: 'none' }}>
                                    <Button variant="secondary" size="sm" style={{
                                        padding: isMobile ? '6px 10px' : '8px 14px',
                                        fontSize: '12px',
                                        minHeight: '36px'
                                    }}>Log In</Button>
                                </Link>
                                <Link to="/register" style={{ display: 'flex', textDecoration: 'none' }}>
                                    <Button size="sm" style={{
                                        padding: isMobile ? '6px 10px' : '8px 14px',
                                        fontSize: '12px',
                                        minHeight: '36px'
                                    }}>Sign Up</Button>
                                </Link>
                            </>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
