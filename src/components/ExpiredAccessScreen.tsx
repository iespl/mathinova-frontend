import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.js';
import GlassCard from './GlassCard.js';
import { Lock } from 'lucide-react';

interface ExpiredAccessScreenProps {
    courseTitle: string;
    courseSlug: string;
    expiryDate?: string;
}

const ExpiredAccessScreen: React.FC<ExpiredAccessScreenProps> = ({ courseTitle, courseSlug, expiryDate }) => {
    const navigate = useNavigate();

    const handleRenewAccess = () => {
        navigate(`/course/${courseSlug}`);
    };

    const handleViewDetails = () => {
        navigate(`/course/${courseSlug}`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
            <GlassCard className="max-w-2xl w-full text-center p-12">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-4">
                    Access to This Course Has Expired
                </h1>

                <div className="text-text-secondary mb-8 space-y-2">
                    {expiryDate ? (
                        <p>Your access expired on {new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                    ) : (
                        <p>Your access to this course has expired.</p>
                    )}
                    <p>Renew your access to continue learning and complete the course materials.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={handleRenewAccess} className="min-w-[200px]">
                        RENEW ACCESS
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleViewDetails} className="min-w-[200px]">
                        View Course Details
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};

export default ExpiredAccessScreen;
