import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import GlassCard from '../components/GlassCard.js';
import Button from '../components/Button.js';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                const { data } = await api.post('/auth/verify-email', { token });
                setStatus('success');
                setMessage(data.message);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be expired.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-glow" />
            <div className="hero-glow-alt" />

            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GlassCard className="w-full animate-fade-in" style={{ maxWidth: '500px', padding: '3rem', textAlign: 'center' }}>
                    {status === 'loading' && (
                        <>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <Loader2 size={48} className="text-primary animate-spin" />
                            </div>
                            <h2 className="text-text-primary" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                                Verifying your email...
                            </h2>
                            <p className="text-base text-text-secondary">
                                Please wait while we validate your activation token.
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                                    <CheckCircle size={48} className="text-green-500" />
                                </div>
                            </div>
                            <h2 className="text-text-primary" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                                Email Verified!
                            </h2>
                            <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                                {message || 'Your account has been successfully activated. You can now access the full platform.'}
                            </p>
                            <Button onClick={() => navigate('/login')} className="w-full" size="lg">
                                Continue to Login
                                <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                                    <XCircle size={48} className="text-red-500" />
                                </div>
                            </div>
                            <h2 className="text-text-primary" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                                Verification Failed
                            </h2>
                            <p className="text-base text-text-secondary" style={{ marginBottom: '2rem' }}>
                                {message}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Button onClick={() => navigate('/login')} variant="primary" className="w-full">
                                    Try Logging In
                                </Button>
                                <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                    Return to Home
                                </Link>
                            </div>
                        </>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
