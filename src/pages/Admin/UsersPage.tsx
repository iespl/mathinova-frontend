import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminClient.js';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await adminApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await adminApi.toggleUserStatus(userId, !currentStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (isLoading) return <div>Loading users...</div>;

    return (
        <div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>User Management</h1>
            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{user.role}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: user.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: user.isActive ? '#10B981' : '#EF4444'
                                    }}>
                                        {user.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <Button
                                        size="sm"
                                        variant="glass"
                                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                                    >
                                        {user.isActive ? 'Disable' : 'Enable'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
};

export default UsersPage;
