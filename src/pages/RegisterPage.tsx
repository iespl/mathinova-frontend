import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import GlassCard from '../components/GlassCard.js';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
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
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-glow" style={{ top: '-20%', left: '-10%' }} />
            <div className="hero-glow-alt" style={{ bottom: '-20%', right: '-10%' }} />

            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GlassCard className="w-full animate-fade-in" style={{ maxWidth: '480px', padding: '3rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Join Mathinova
                        </h2>
                        <p className="text-sm text-text-secondary">
                            Access world-class engineering education and elite resources.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Prof. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="mastery@mathinova.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Set Secure Password"
                            type="password"
                            placeholder="Minimum 8 complex characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />

                        {error && (
                            <div className="bg-red-400/10 border border-red-400/20 p-3 rounded-lg mb-4">
                                <p className="text-xs text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                            Initialize Account
                        </Button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p className="text-sm text-text-secondary">
                            Already a member?{' '}
                            <Link to="/login" style={{ color: 'var(--primary-violet)', fontWeight: '600', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default RegisterPage;
