import React from 'react';
import GlassCard from './GlassCard.js';
import Button from './Button.js';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        basePrice: number;
        currency: string;
        thumbnail?: string;
        pricingType?: 'paid' | 'free';
        branch?: string;
    };
    onPreview: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPreview }) => {
    console.log('Rendering CourseCard:', course.title);
    return (
        <GlassCard className="flex flex-col h-full" style={{ padding: '0.75rem' }}>
            <div
                onClick={onPreview}
                className="course-card-thumbnail-container"
            >
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 opacity-40">
                        <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                            <span className="text-xs">?</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Preview Unavailable</span>
                    </div>
                )}
            </div>

            <h3
                className="font-bold text-base leading-tight h-10 overflow-hidden display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical cursor-pointer"
                style={{ marginBottom: '0.5rem' }}
                onClick={onPreview}
            >
                {course.title}
            </h3>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface border border-border-default text-text-secondary uppercase tracking-wider">
                    {course.pricingType === 'free' ? 'Free Pack' : 'Full Pack'}
                </span>
            </div>
            <p className="text-xs text-text-secondary line-clamp-2" style={{ marginBottom: '0.75rem' }}>
                {course.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span className="font-bold text-sm">
                    {course.pricingType === 'free' || course.basePrice === 0 ? (
                        <span style={{ color: 'var(--accent-glow)', textShadow: '0 0 10px var(--accent-glow)' }}>FREE</span>
                    ) : (
                        `${course.currency} ${course.basePrice}`
                    )}
                </span>
                <Button size="sm" variant="glass" onClick={onPreview}>Learn More</Button>
            </div>
        </GlassCard>
    );
};

export default CourseCard;
