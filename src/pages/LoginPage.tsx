import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import GlassCard from '../components/GlassCard.js';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-glow" />
            <div className="hero-glow-alt" />

            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GlassCard className="w-full animate-fade-in" style={{ maxWidth: '400px', padding: '3rem' }}>
                    <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                        <h2 className="text-text-primary" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Welcome back
                        </h2>
                        <p className="text-base text-text-secondary">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="bg-red-400/10 border border-red-400/20 p-3 rounded-lg mb-4">
                                <p className="text-xs text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                            Enter Platform
                        </Button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p className="text-sm text-text-secondary">
                            New to Mathinova?{' '}
                            <Link to="/register" style={{ color: 'var(--primary-violet)', fontWeight: '600', textDecoration: 'none' }}>
                                Create an account
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default LoginPage;
