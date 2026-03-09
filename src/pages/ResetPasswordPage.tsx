import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import Button from '../components/Button.js';
import GlassCard from '../components/GlassCard.js';
import Input from '../components/Input.js';
import { Lock, CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setStatus('error');
            return;
        }

        if (newPassword.length < 8) {
            setMessage('Password must be at least 8 characters.');
            setStatus('error');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setStatus('idle');

        try {
            const { data } = await api.post('/auth/reset-password', { token, newPassword });
            setMessage(data.message);
            setStatus('success');
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to reset password.');
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="hero-glow" />
                <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '2rem' }}>
                    <GlassCard style={{ maxWidth: '420px', padding: '3rem', textAlign: 'center' }}>
                        <XCircle size={48} style={{ color: '#f87171', margin: '0 auto 1rem' }} />
                        <h2 className="text-text-primary" style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Invalid Link</h2>
                        <p className="text-text-secondary" style={{ marginBottom: '2rem' }}>This reset link is invalid. Please request a new one.</p>
                        <Button onClick={() => navigate('/forgot-password')} variant="primary">
                            Request New Link
                        </Button>
                    </GlassCard>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-glow" />
            <div className="hero-glow-alt" />

            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GlassCard className="w-full animate-fade-in" style={{ maxWidth: '420px', padding: '3rem', textAlign: 'center' }}>

                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ backgroundColor: status === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            {status === 'success'
                                ? <CheckCircle size={48} style={{ color: '#4ade80' }} />
                                : <Lock size={48} className="text-primary" />
                            }
                        </div>
                    </div>

                    {status === 'success' ? (
                        <>
                            <h2 className="text-text-primary" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
                                Password Reset!
                            </h2>
                            <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                                {message}
                            </p>
                            <Button onClick={() => navigate('/login')} variant="primary" className="w-full">
                                Log In Now
                            </Button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-text-primary" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                Set new password
                            </h2>
                            <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                                Choose a strong password for your account.
                            </p>

                            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="At least 8 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="Repeat your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />

                                {message && status === 'error' && (
                                    <div className="bg-red-400/10 border border-red-400/20 p-3 rounded-lg mb-4">
                                        <p className="text-xs text-red-400 text-center">{message}</p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                                    Reset Password
                                </Button>
                            </form>
                        </>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
