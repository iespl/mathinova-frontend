import React from 'react';
import Button from './Button';

const PromotionalBanner: React.FC = () => {
    return (
        <div className="w-full relative overflow-hidden animate-fade-in" style={{
            height: '480px',
            background: 'linear-gradient(90deg, #8B1D24 0%, #A9262E 100%)',
            paddingTop: '80px' // Clear the filtered/fixed navbar
        }}>
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '24px 24px'
            }} />

            <div className="container h-full flex items-center justify-between relative z-10">
                {/* Left Content */}
                <div className="flex flex-col items-start gap-4 max-w-2xl">
                    <h1 className="font-heading font-black text-white italic leading-tight" style={{ fontSize: '3.5rem', textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                        One EXAM. Endless <span className="text-[#FFD700]">POSSIBILITIES.</span>
                    </h1>
                    <p className="text-xl text-white font-medium italic mb-6">
                        Designed for students who mean it.
                    </p>

                    <div className="flex items-center gap-8 bg-black/20 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="flex flex-col">
                            <span className="text-white/80 text-sm font-bold tracking-widest mb-1">GET UPTO</span>
                            <span className="text-[#FFD700] text-6xl font-black leading-none">90%</span>
                            <span className="text-white text-2xl font-bold">Scholarship</span>
                        </div>
                        <div className="h-20 w-px bg-white/20" />
                        <div className="flex flex-col gap-3">
                            <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-3 w-[320px]">
                                <span className="text-[#8B1D24]">📅</span>
                                <div className="flex flex-col">
                                    <span className="text-[#8B1D24] text-xs font-bold uppercase">Online Dates</span>
                                    <span className="text-black text-sm font-bold">1st to 20th February</span>
                                </div>
                            </div>
                            <Button
                                className="w-full text-black font-black uppercase text-lg tracking-wider"
                                style={{
                                    background: '#FFD700',
                                    color: '#000',
                                    padding: '1rem 2rem',
                                    boxShadow: '0 4px 0 #B8860B, 0 8px 20px rgba(0,0,0,0.3)'
                                }}
                            >
                                Register Now For Free 👉
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Content / Image Placeholder */}
                <div className="hidden lg:block h-full relative" style={{ width: '400px' }}>
                    {/* Using a gradient circle to represent the person for now as we don't have the asset */}
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-black/50 to-transparent z-0" />
                    {/* This would be the person image */}
                    <div className="absolute bottom-0 right-10 w-[300px] h-[380px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-t border-x border-white/20 rounded-t-full flex items-center justify-center">
                        <span className="text-white/20 font-heading font-bold text-4xl rotate-[-10deg]">Vidyapeeth</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionalBanner;
