import React from 'react';

const ScrollingTicker: React.FC = () => {
    const messages = [
        "📢 New Batches Starting Soon!",
        "🏆 90% Scholarship Available - Register Now",
        "🚀 Master Engineering with Precision",
        "📅 Live Classes starting from 1st Feb",
        "💡 Join the topper's league"
    ];

    const content = messages.join(" • ");

    return (
        <div className="w-full bg-[#FFD700] overflow-hidden py-3 border-b border-white/10 relative z-20">
            <div className="animate-marquee">
                {/* Quadruplicate content for seamless looping on wide screens */}
                <span className="text-black font-bold text-lg uppercase tracking-wider mx-4">{content}</span>
                <span className="text-black font-bold text-lg uppercase tracking-wider mx-4">{content}</span>
                <span className="text-black font-bold text-lg uppercase tracking-wider mx-4">{content}</span>
                <span className="text-black font-bold text-lg uppercase tracking-wider mx-4">{content}</span>
            </div>
        </div>
    );
};

export default ScrollingTicker;
