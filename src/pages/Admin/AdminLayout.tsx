import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import GlassCard from '../../components/GlassCard.js';
import Navbar from '../../components/Navbar.js';

const AdminLayout: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Courses', path: '/admin/courses' },
        { label: 'Branches', path: '/admin/branches' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2rem 0', marginTop: '5.5rem' }}>
                <aside style={{ width: '250px', flexShrink: 0 }}>
                    <GlassCard style={{ padding: '1.5rem' }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        background: location.pathname === item.path ? 'var(--primary-violet-glow)' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </GlassCard>
                </aside>
                <main style={{ flex: 1 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
