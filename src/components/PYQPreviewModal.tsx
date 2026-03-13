import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, BookOpen, Play } from 'lucide-react';
import RichTextDisplay from './RichTextDisplay';
import Button from './Button';

interface PYQPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    activePyq: any;
    isEnrolled?: boolean;
    onUnlock?: () => void;
}

const PYQPreviewModal: React.FC<PYQPreviewModalProps> = ({ 
    isOpen, 
    onClose, 
    activePyq, 
    isEnrolled = false,
    onUnlock 
}) => {
    const [isMobile, setIsMobile] = useState(false);

    // Track window width for conditional rendering (mobile vs desktop)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent background scroll and handle ESC key when modal is open
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !activePyq) return null;

    return createPortal(
        <div
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000000,
                backgroundColor: 'rgba(5, 5, 10, 0.85)',
                backdropFilter: 'blur(10px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: isMobile ? '0' : '20px 10px',
                boxSizing: 'border-box'
            }}
            onClick={onClose}
        >
            {/* Modal Box */}
            <div
                style={{ 
                    position: 'relative',
                    width: '100%',
                    maxWidth: isMobile ? '100%' : '1100px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: isMobile ? '0' : '24px',
                    border: isMobile ? 'none' : '1px solid #E2E8F0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: isMobile ? '0' : '40px',
                    marginBottom: isMobile ? '0' : '40px',
                    minHeight: isMobile ? '100vh' : 'auto',
                    color: '#000000',
                    boxSizing: 'border-box',
                    overflowX: 'hidden' 
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Sticky Header */}
                <div 
                    style={{
                        position: 'sticky',
                        top: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? '16px 20px' : '20px 30px',
                        borderBottom: '1px solid #E2E8F0',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(16px)',
                        zIndex: 100,
                        borderTopLeftRadius: isMobile ? '0' : '24px',
                        borderTopRightRadius: isMobile ? '0' : '24px',
                        boxSizing: 'border-box'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                            display: 'flex', 
                            height: '40px', 
                            width: '40px', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            borderRadius: '12px', 
                            backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                            color: '#8B5CF6',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.15em' }}> Premium Preview</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                                <span style={{ textTransform: 'uppercase', color: '#8B5CF6' }}>{activePyq.difficulty || 'Standard'}</span>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#E2E8F0' }} />
                                <span style={{ color: '#10b981', letterSpacing: '-0.025em', textTransform: 'uppercase', fontWeight: 900, fontSize: '10px' }}>Verified Solution</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            height: '44px',
                            width: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B',
                            backgroundColor: 'transparent',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box'
                        }}
                    >
                        <span style={{ fontSize: '24px', fontWeight: 300 }}>&times;</span>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: isMobile ? '24px 20px' : '40px 60px', paddingBottom: '80px', boxSizing: 'border-box' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}>
                        {/* Question Section */}
                        <div style={{ marginBottom: isMobile ? '40px' : '60px', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ height: '24px', width: '4px', backgroundColor: '#8B5CF6', borderRadius: '4px' }} />
                                <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#000000' }}>Problem Statement</h3>
                            </div>
                            
                            <div style={{ 
                                backgroundColor: '#F8FAFC',
                                borderRadius: '24px', 
                                padding: isMobile ? '24px 20px' : '40px', 
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                boxSizing: 'border-box',
                                overflowX: 'hidden'
                            }}>
                                <RichTextDisplay 
                                    htmlContent={activePyq.questionText} 
                                    fullWidthImages={true}
                                    style={{ fontSize: isMobile ? '16px' : '18px', color: '#000000', lineHeight: 1.7, fontWeight: 500 }}
                                />
                                {activePyq.questionImages?.map((img: string, i: number) => (
                                    <div key={i} style={{ 
                                        marginTop: '20px', 
                                        marginLeft: isMobile ? '-20px' : '-40px',
                                        marginRight: isMobile ? '-20px' : '-40px',
                                        width: `calc(100% + ${isMobile ? '40px' : '80px'})`,
                                        overflow: 'hidden', 
                                        borderTop: '1px solid #E2E8F0',
                                        borderBottom: '1px solid #E2E8F0' 
                                    }}>
                                        <img src={img} alt="" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Official Records */}
                        {activePyq.occurrences && activePyq.occurrences.length > 0 && (
                            <div style={{ marginBottom: isMobile ? '40px' : '60px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#64748B', display: 'block', marginBottom: '16px' }}>Official Exam Records</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {activePyq.occurrences.map((occ: any, i: number) => (
                                        <div key={i} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px', 
                                            padding: '8px 12px', 
                                            borderRadius: '12px', 
                                            backgroundColor: '#F1F5F9', 
                                            border: '1px solid #E2E8F0', 
                                            fontSize: '11px', 
                                            color: '#000000'
                                        }}>
                                            <BookOpen size={13} style={{ color: '#8B5CF6' }} />
                                            <span style={{ fontWeight: 600 }}>{occ.courseCode} • {occ.month} {occ.year}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Solution Section */}
                        <div style={{ marginTop: '40px', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ height: '24px', width: '4px', backgroundColor: '#10b981', borderRadius: '4px' }} />
                                <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#10b981' }}>Instructor Solution</h3>
                            </div>
                            <div style={{ 
                                backgroundColor: '#F0FDF4',
                                borderRadius: '24px', 
                                padding: isMobile ? '24px 20px' : '40px', 
                                border: '1px solid #DCFCE7',
                                boxSizing: 'border-box',
                                overflowX: 'hidden'
                            }}>
                                <RichTextDisplay 
                                    htmlContent={activePyq.answerText || '<em style="opacity: 0.5; color: #64748B">Full detailed solution is being prepared...</em>'} 
                                    fullWidthImages={true}
                                    style={{ fontSize: isMobile ? '16px' : '18px', color: '#000000', lineHeight: 1.7 }}
                                />
                                {activePyq.answerImages?.map((img: string, i: number) => (
                                    <div key={i} style={{ 
                                        marginTop: '20px', 
                                        marginLeft: isMobile ? '-20px' : '-60px',
                                        marginRight: isMobile ? '-20px' : '-60px',
                                        width: `calc(100% + ${isMobile ? '40px' : '120px'})`,
                                        overflow: 'hidden', 
                                        borderTop: '1px solid #DCFCE7',
                                        borderBottom: '1px solid #DCFCE7' 
                                    }}>
                                        <img src={img} alt="" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {activePyq.solutionVideoUrl && (
                            <div style={{ 
                                marginTop: '60px',
                                background: 'linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%)', 
                                borderRadius: '32px', 
                                padding: isMobile ? '24px 20px' : '40px', 
                                border: '1px solid #DDD6FE', 
                                display: 'flex', 
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'flex-start' : 'center', 
                                justifyContent: 'space-between', 
                                gap: '32px',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '32px' }}>
                                    <div style={{ height: isMobile ? '56px' : '80px', width: isMobile ? '56px' : '80px', borderRadius: '16px', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                                        <Play size={isMobile ? 22 : 28} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 900, fontSize: isMobile ? '18px' : '20px', color: '#000000', margin: '0 0 8px 0' }}>Watch Expert Solution</h4>
                                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, maxWidth: '400px', margin: 0 }}>Learn the shortcuts and logical patterns used to solve this problem.</p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={onUnlock}
                                    style={{
                                        width: isMobile ? '100%' : 'auto',
                                        padding: '16px 40px',
                                        fontSize: '11px',
                                        height: 'auto',
                                        backgroundColor: '#8B5CF6',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '12px'
                                    }}
                                >
                                    Unlock Video
                                </Button>
                            </div>
                        )}

                        {!isEnrolled && (
                            <div style={{ padding: isMobile ? '60px 0' : '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', textAlign: 'center', borderTop: '1px solid #E2E8F0', marginTop: '60px', boxSizing: 'border-box' }}>
                                <div style={{ maxWidth: '512px' }}>
                                    <h4 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, color: '#000000', marginBottom: '16px' }}>Don't Just Practice. Master.</h4>
                                    <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#475569', lineHeight: 1.6 }}>Enroll today to get instant access to 250+ solved questions and premium video walkthroughs.</p>
                                </div>
                                <Button 
                                    onClick={onUnlock}
                                    style={{
                                        width: isMobile ? '100%' : 'auto',
                                        padding: '20px 40px',
                                        fontSize: '14px',
                                        fontWeight: 900,
                                        backgroundColor: '#8B5CF6',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '16px'
                                    }}
                                >
                                    Start Learning Now &rarr;
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PYQPreviewModal;
