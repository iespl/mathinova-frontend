import React from 'react';
import Button from './Button.js';
import heroEngineering from '../assets/hero-engineering.jpg';

const Hero: React.FC = () => {
    return (
        <div className="container" style={{ padding: '8rem 0 6rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '1rem' }}>
                        Master Engineering <br /> with Precision.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '480px', lineHeight: '1.6' }}>
                        High-performance, deep-dive learning for serious students. Mathinova delivers professional-grade technical education through a premium cyber-interface.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button size="lg">Get Started</Button>
                    </div>
                </div>

                <div className="glass-card" style={{ height: '400px', width: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}>
                    <img
                        src={heroEngineering}
                        alt="Engineering Excellence"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)',
                        opacity: 0.6
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Hero;
