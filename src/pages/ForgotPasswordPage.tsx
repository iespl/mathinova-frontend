import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Button from '../components/Button.js';
import GlassCard from '../components/GlassCard.js';
import Input from '../components/Input.js';
import { KeyRound, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-glow" />
            <div className="hero-glow-alt" />

            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '2rem' }}>
                <GlassCard className="w-full animate-fade-in" style={{ maxWidth: '420px', padding: '3rem', textAlign: 'center' }}>

                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            {submitted
                                ? <CheckCircle size={48} style={{ color: '#4ade80' }} />
                                : <KeyRound size={48} className="text-primary" />
                            }
                        </div>
                    </div>

                    {submitted ? (
                        <>
                            <h2 className="text-text-primary" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
                                Check your inbox
                            </h2>
                            <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                                If an account exists for <strong className="text-text-primary">{email}</strong>, we've sent a password reset link. Check your spam folder too.
                            </p>
                            <Link to="/login" style={{ color: 'var(--primary-violet)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
                                ← Back to Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2 className="text-text-primary" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                Forgot password?
                            </h2>
                            <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                                Enter your email and we'll send you a reset link.
                            </p>

                            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                {error && (
                                    <div className="bg-red-400/10 border border-red-400/20 p-3 rounded-lg mb-4">
                                        <p className="text-xs text-red-400 text-center">{error}</p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                                    Send Reset Link
                                </Button>
                            </form>

                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <Link to="/login" style={{ color: 'var(--primary-violet)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
                                    ← Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
