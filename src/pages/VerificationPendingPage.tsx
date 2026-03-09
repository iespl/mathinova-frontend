import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import Button from '../components/Button.js';
import GlassCard from '../components/GlassCard.js';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

const VerificationPendingPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResend = async () => {
        if (!email) {
            setError('Email address not found. Please try logging in again.');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await api.post('/auth/resend-verification', { email });
            setMessage(data.message);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-glow" />
            <div className="hero-glow-alt" />

            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GlassCard className="w-full animate-fade-in" style={{ maxWidth: '500px', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            <Mail size={48} className="text-primary" />
                        </div>
                    </div>

                    <h2 className="text-text-primary" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Verify your email
                    </h2>

                    <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                        We've sent a verification link to <strong className="text-text-primary">{email || 'your email'}</strong>.
                        Please check your inbox and click the link to activate your account.
                    </p>

                    {message && (
                        <div className="bg-green-400/10 border border-green-400/20 p-4 rounded-lg mb-6">
                            <p className="text-sm text-green-400">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-400/10 border border-red-400/20 p-4 rounded-lg mb-6">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button
                            onClick={handleResend}
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
                            Resend Verification Email
                        </Button>

                        <Button
                            onClick={() => navigate('/login')}
                            variant="secondary"
                            className="w-full"
                        >
                            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
                            Back to Login
                        </Button>
                    </div>

                    <p className="text-xs text-text-secondary" style={{ marginTop: '2rem' }}>
                        Didn't receive the email? Check your spam folder or try resending.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
};

export default VerificationPendingPage;
