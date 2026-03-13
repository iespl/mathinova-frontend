import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import GlassCard from '../components/GlassCard.js';
import Button from '../components/Button.js';
import VideoPlayer from '../components/VideoPlayer.js';
import {
    BookOpen,
    Video,
    FileText,
    HelpCircle,
    ArrowRight,
    CheckCircle2,
    Layers,
    Clock,
    Award,
    Play,
    Smartphone,
    Trophy,
    Infinity,
    Mail,
    Twitter,
    Link as LinkIcon,
    ChevronDown,
    Lock
} from 'lucide-react';

import CourseDescription from '../components/CourseDescription.js';
import Math2Description from '../components/Math2Description.js';
import RichTextDisplay from '../components/RichTextDisplay.js';
import PYQPreviewModal from '../components/PYQPreviewModal.js';


// Format price with correct currency symbol
function formatPrice(amount: number | string, currency: string): string {
    const num = Number(amount);
    if (isNaN(num)) return String(amount);
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[currency?.toUpperCase()] ?? currency ?? '₹';
    return `${symbol}${num.toLocaleString('en-IN')}`;
}

// Convert any YouTube watch/share URL to an embed URL
function toYouTubeEmbedUrl(url: string): string {
    if (!url) return url;
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) return url;
    // youtu.be short link
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // Standard watch URL
    const watchMatch = url.match(/[?&]v=([^?&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return url;
}

function formatDuration(seconds?: number): string {
    if (!seconds) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDurationText(seconds?: number): string {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m}m`;
}

const CourseDetailPage: React.FC = () => {

    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState<any>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openModules, setOpenModules] = useState<number[]>([0]);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
    const [isPyqModalOpen, setIsPyqModalOpen] = useState(false);
    const [activePyq, setActivePyq] = useState<any>(null);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        // Sync immediately on mount
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        // Also listen to resize as a fallback
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', onResize);
        return () => {
            mq.removeEventListener('change', handler);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Scroll to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Prevent background scroll and handle ESC key when modal is open
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsPyqModalOpen(false);
                setActivePyq(null);
            }
        };

        if (isPyqModalOpen) {
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
    }, [isPyqModalOpen]);

    const toggleModule = (idx: number) => {
        setOpenModules(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };
    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [isViewingPromo, setIsViewingPromo] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { data: courseData } = await api.get(`/courses/public/${slug}`);
                setCourse(courseData);

                if (user) {
                    const { data: enrollments } = await api.get('/student/courses');
                    const enrollment = enrollments.find((e: any) => e.courseId === courseData.id);

                    if (enrollment) {
                        const expired = enrollment.isExpired || enrollment.status === 'expired';
                        setIsEnrolled(!expired); // Only set enrolled if NOT expired
                        setIsExpired(expired);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch course data', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourseData();
    }, [slug, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-obsidian flex items-center justify-center" style={{ paddingTop: '5rem' }}>
                <div className="animate-pulse text-primary text-xl font-bold tracking-widest uppercase">Initializing...</div>
            </div>
        );
    }


    if (!course) {
        return (
            <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4" style={{ paddingTop: '5rem' }}>
                <h1 className="text-3xl font-bold mb-4 text-text-primary">Course Not Found</h1>
                <Button onClick={() => navigate('/discovery')}>Back to Catalog</Button>
            </div>
        );
    }


    const stripAndDecode = (html: string) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const handleCTA = async () => {
        // If enrollment is expired, go to checkout for renewal
        if (isExpired) {
            navigate(`/checkout/${course.id}`);
            return;
        }

        // If actively enrolled, go to classroom
        if (isEnrolled) {
            navigate(`/learn/${course.slug || course.id}`);
            return;
        }

        // If free course and not enrolled, enroll directly
        if (course.pricingType === 'free') {
            try {
                setIsLoading(true);
                await api.post('/student/enroll-free', { courseId: course.id });
                navigate(`/learn/${course.id}`);
            } catch (err) {
                console.error('Failed to enroll in free course', err);
                alert('Failed to enroll. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Paid course, not enrolled - go to checkout
            navigate(`/checkout/${course.id}`);
        }
    };

    const stats = [
        { label: 'Modules', value: course._counts?.modules || 0, icon: Layers, color: 'text-blue-400' },
        { label: 'Lessons', value: course._counts?.lessons || 0, icon: BookOpen, color: 'text-violet-400' },
        { label: 'Videos', value: course._counts?.videos || 0, icon: Video, color: 'text-emerald-400' },
        { label: 'Practice', value: (course._counts?.quizzes || 0) + (course._counts?.pyqs || 0), icon: HelpCircle, color: 'text-orange-400' },
    ];

    const totalCourseDuration = course?.modules?.reduce((acc: number, mod: any) =>
        acc + (mod.lessons?.reduce((lAcc: number, lsn: any) =>
            lAcc + (lsn.videos?.reduce((vAcc: number, vid: any) => vAcc + (vid.duration || 0), 0) || 0)
            , 0) || 0)
        , 0) || 0;

    // Filter all sample content for the Premium Showcase
    const samplePYQs = course.modules?.flatMap((mod: any) => 
        mod.lessons?.flatMap((lsn: any) => 
            lsn.pyqs?.filter((p: any) => p.isSample).map((p: any) => ({ ...p, lessonTitle: lsn.title }))
        )
    ).filter(Boolean) || [];

    const sampleVideos = course.modules?.flatMap((mod: any) => 
        mod.lessons?.flatMap((lsn: any) => 
            lsn.videos?.filter((v: any) => v.isSample).map((v: any) => ({ ...v, lessonTitle: lsn.title }))
        )
    ).filter(Boolean) || [];

    const hasSamples = samplePYQs.length > 0 || sampleVideos.length > 0;

    return (
        <>
            <div className="min-h-screen bg-bg-obsidian text-text-primary transition-colors duration-300">
                {/* Background Gradient Mesh */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[150px]" />
                </div>

                <div className="container course-detail-wrap relative z-10" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
                    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mb-8 font-medium">
                        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
                        <span className="opacity-50">›</span>
                        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/discovery')}>{course.branch || 'Courses'}</span>
                        <span className="opacity-50">›</span>
                        <span className="text-text-primary font-bold truncate max-w-[200px] lg:max-w-none">{course.title}</span>
                    </div>

                    <div className="grid lg:grid-cols-12 items-start" style={{ gap: '4rem' }}>

                        {/* LEFT COLUMN - Video & Info */}
                        <div className="lg:col-span-8 space-y-8 min-w-0">
                            <div className="space-y-6">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary tracking-wide flex items-center md:gap-1.5">
                                        <Award size={12} className="hidden md:inline" /> Premium
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full bg-bg-glass border border-border-default text-[11px] font-bold text-text-secondary tracking-wide">
                                        Updated Feb 2025
                                    </span>
                                </div>

                                <h1 className="text-3xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15] text-text-primary">
                                    {course.title}
                                </h1>
                                <p className="text-lg text-text-secondary leading-relaxed max-w-3xl font-medium">
                                    {course.description}
                                </p>
                            </div>

                            {/* Video Player Area */}
                            <div className="aspect-video overflow-hidden shadow-2xl relative group bg-bg-obsidian rounded-2xl">
                                {isViewingPromo && course.promoVideoUrl ? (
                                    <iframe
                                        src={toYouTubeEmbedUrl(course.promoVideoUrl)}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Course Preview"
                                    />
                                ) : activeVideo ? (
                                    <VideoPlayer
                                        key={activeVideo.id}
                                        src={activeVideo.videoUrl}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative cursor-pointer" onClick={() => setIsViewingPromo(true)}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/10 transition-opacity group-hover:opacity-80" />
                                        <img src={course.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105" alt="Preview" />

                                        {/* Centered Play Button */}
                                        <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-110">
                                            <Play size={32} className="text-primary fill-current ml-1" />
                                        </div>

                                        {/* Bottom Preview Subtext */}
                                        <div className="absolute bottom-10 left-0 right-0 text-center z-10 group-hover:translate-y-[-4px] transition-transform">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-widest">
                                                <Play size={10} className="fill-current" /> Preview this course (2:45)
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {Array.isArray(course.learningPoints) && course.learningPoints.length > 0 && (
                                <GlassCard className="p-6 md:p-10 border-white/5">
                                    <h2 className="text-2xl font-serif font-black tracking-tight mb-8 text-text-primary">What you'll learn</h2>
                                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                        {course.learningPoints.map((item: string, i: number) => (
                                            <div key={i} className="flex items-start gap-4 text-[15px] text-text-secondary leading-normal">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 size={13} className="text-primary" />
                                                </div>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            )}


                            {/* Detailed Description */}
                            {course.longDescription ? (
                                <div className="prose-simple max-w-none text-text-secondary" dangerouslySetInnerHTML={{
                                    __html: course.longDescription.replace(/\n/g, '<br/>')
                                }} />
                            ) : (
                                <>
                                    {slug === 'structural-engineering-theory-practice' && (
                                        <CourseDescription />
                                    )}
                                    {slug === 'advanced-structural-dynamics' && (
                                        <Math2Description />
                                    )}
                                </>
                            )}

                            {/* Premium Showcase - Featured Previews */}
                            {!isEnrolled && hasSamples && (
                                <section className="pt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 px-4">Premium Showcase</h3>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Featured Videos */}
                                        {sampleVideos.map((vid: any) => (
                                            <GlassCard 
                                                key={vid.id} 
                                                className="p-5 border-blue-400/20 hover:border-blue-400/50 transition-all group flex flex-col gap-4 cursor-pointer"
                                                onClick={() => {
                                                    setActiveVideo(vid);
                                                    setIsViewingPromo(false);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="bg-blue-400/10 p-2 rounded-lg">
                                                        <Play size={18} className="text-blue-400" />
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-400/20 text-blue-400 uppercase tracking-tighter">Preview Video</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-text-primary group-hover:text-blue-400 transition-colors line-clamp-1">{vid.title}</h4>
                                                    <p className="text-[10px] text-text-muted mt-1 uppercase font-semibold tracking-wide">In: {vid.lessonTitle}</p>
                                                </div>
                                            </GlassCard>
                                        ))}

                                        {/* Featured PYQs */}
                                        {samplePYQs.map((pyq: any) => (
                                            <GlassCard 
                                                key={pyq.id} 
                                                className="p-5 border-primary-cyan/20 hover:border-primary-cyan/50 transition-all group flex flex-col gap-4 cursor-pointer"
                                                onClick={() => {
                                                    setActivePyq(pyq);
                                                    setIsPyqModalOpen(true);
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="bg-primary-cyan/10 p-2 rounded-lg">
                                                        <FileText size={18} className="text-primary-cyan" />
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary-cyan/20 text-primary-cyan uppercase tracking-tighter">Preview PYQ</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary-cyan transition-colors line-clamp-2">
                                                        {stripAndDecode(pyq.questionText || 'Answered PYQ')}
                                                    </h4>
                                                    <p className="text-[10px] text-text-muted mt-1 uppercase font-semibold tracking-wide">In: {pyq.lessonTitle}</p>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] text-text-muted font-medium italic italic">Get a taste of our premium curriculum above</p>
                                    </div>
                                </section>
                            )}

                            {/* Curriculum Accordion */}
                            <div className="pt-8 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-serif font-black tracking-tight text-text-primary mb-2">Course Curriculum</h2>
                                    <div className="text-sm text-text-muted font-medium flex items-center gap-2">
                                        <span>{course._counts?.modules} sections</span>
                                        <span className="opacity-30">•</span>
                                        <span>{course._counts?.lessons} lessons</span>
                                        <span className="opacity-30">•</span>
                                        <span>{formatDurationText(totalCourseDuration)} total duration</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {course.modules?.map((mod: any, mIdx: number) => {
                                        const isOpen = openModules.includes(mIdx);
                                        return (
                                            <div key={mod.id} className="bg-bg-glass border border-border-glass rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                                                <div
                                                    onClick={() => toggleModule(mIdx)}
                                                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.03] select-none"
                                                >
                                                    <div className="flex-1">
                                                        <span className="font-bold text-[15px] tracking-tight text-text-primary">
                                                            {mIdx + 1}. {mod.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-[13px] text-text-muted font-medium">
                                                        <div className="hidden sm:flex items-center gap-4">
                                                            <span>{mod.lessons?.length || 0} lessons</span>
                                                            <span className="opacity-30">•</span>
                                                            <span>{formatDurationText(mod.lessons?.reduce((lAcc: number, lsn: any) => lAcc + (lsn.videos?.reduce((vAcc: number, vid: any) => vAcc + (vid.duration || 0), 0) || 0), 0))}</span>
                                                        </div>
                                                        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>

                                                {/* Accordion content - always in DOM, animated via max-height */}
                                                <div
                                                    style={{
                                                        maxHeight: isOpen ? '9999px' : '0px',
                                                        overflow: 'hidden',
                                                        transition: 'max-height 0.35s ease-in-out',
                                                    }}
                                                >
                                                    <div className="border-t border-border-glass divide-y divide-white/[0.03]">
                                                        {mod.lessons?.map((lesson: any, lIdx: number) => (
                                                            <div key={lesson.id} className="flex flex-col border-b border-border-glass last:border-0 pl-1">
                                                                <div className="px-8 py-3 bg-white/[0.01]">
                                                                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-text-primary/70 mb-1">
                                                                        {lesson.title}
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4 border-l border-white/[0.04]">
                                                                    {lesson.videos?.map((vid: any) => (
                                                                        <div
                                                                            key={vid.id}
                                                                            onClick={vid.isSample ? () => { 
                                                                                setActiveVideo(vid); 
                                                                                setIsViewingPromo(false); 
                                                                                window.scrollTo({ top: 300, behavior: 'smooth' }); 
                                                                            } : handleCTA}
                                                                            className="flex items-center gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer group overflow-hidden px-[20px] md:px-[42px] py-3"
                                                                        >
                                                                            <Play size={16} className={`text-text-muted opacity-40 ${vid.isSample ? 'text-blue-400' : ''}`} />
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="text-sm font-medium leading-tight text-text-muted group-hover:text-text-secondary transition-colors flex items-center gap-2">
                                                                                    {vid.title}
                                                                                    {vid.isSample && (
                                                                                        <span className="px-1.5 py-0.5 rounded-[4px] bg-blue-400/10 text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Preview</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="flex items-center gap-4 text-sm tabular-nums font-medium shrink-0"
                                                                                style={{ marginLeft: 'auto', width: '8rem', justifyContent: 'flex-end', textAlign: 'right' }}
                                                                            >
                                                                                <span className="text-text-muted opacity-60 min-w-[40px]">{formatDuration(vid.duration)}</span>
                                                                                {!vid.isSample && !isEnrolled && <Lock size={12} className="text-text-muted opacity-30" />}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {/* 2. PYQ Practice - only show FREE sample PYQs individually, show summary for paid ones */}
                                                                    {lesson.pyqs?.length > 0 && (
                                                                        <div className="flex flex-col">
                                                                            {/* Main row */}
                                                                            <div
                                                                                onClick={lesson.pyqs.some((p: any) => p.isSample) ? undefined : handleCTA}
                                                                                className={`flex items-center gap-4 transition-colors cursor-pointer group px-[20px] md:px-[42px] py-[10px] ${lesson.pyqs.some((p: any) => p.isSample) ? 'cursor-default' : 'hover:bg-white/[0.04] opacity-80'}`}
                                                                            >
                                                                                <FileText size={15} className="text-text-muted opacity-40" />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <div className="text-sm font-bold text-primary group-hover:text-primary-cyan transition-colors flex items-center gap-2">
                                                                                        {lesson.pyqs.length} PYQs available
                                                                                        {lesson.pyqs.some((p: any) => p.isSample) && (
                                                                                            <span className="px-1.5 py-0.5 rounded-[4px] bg-primary-cyan/10 text-[9px] font-bold text-primary-cyan uppercase tracking-tighter shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.1)]">Samples Included</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                {!lesson.pyqs.some((p: any) => p.isSample) && !isEnrolled && (
                                                                                    <div className="shrink-0" style={{ width: '8rem', textAlign: 'right' }}>
                                                                                        <Lock size={12} className="text-text-muted opacity-30 inline" />
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Individual sample chips if guest */}
                                                                            {!isEnrolled && lesson.pyqs.some((p: any) => p.isSample) && (
                                                                                <div className="flex flex-wrap gap-2 px-[20px] md:px-[42px] pb-4 pl-[45px] md:pl-[75px]">
                                                                                    {lesson.pyqs.filter((p: any) => p.isSample).map((p: any) => (
                                                                                        <button 
                                                                                            key={p.id}
                                                                                            onClick={() => { setActivePyq(p); setIsPyqModalOpen(true); }}
                                                                                            className="px-3 py-1.5 rounded-lg bg-primary-cyan/5 border border-primary-cyan/20 hover:bg-primary-cyan/10 hover:border-primary-cyan/40 text-[10px] font-bold text-primary-cyan transition-all flex items-center gap-2 group/btn"
                                                                                        >
                                                                                            <Play size={10} className="fill-current opacity-40 group-hover/btn:opacity-100" />
                                                                                            Preview Sample
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* 3. Lesson Quiz */}
                                                                    {lesson.quiz && (
                                                                        <div
                                                                            className="flex items-center gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer group opacity-60 px-[20px] md:px-[42px] py-3"
                                                                        >
                                                                            <HelpCircle size={16} className="text-text-muted" />
                                                                            <div className="flex-1">
                                                                                <div className="text-sm font-medium text-text-muted italic">Quiz: Lesson Mastery</div>
                                                                            </div>
                                                                            <div
                                                                                className="text-sm text-text-muted font-medium shrink-0"
                                                                                style={{ marginLeft: 'auto', width: '8rem', textAlign: 'right' }}
                                                                            >
                                                                                10 questions
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Sticky CTA Area */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                            {/* Price & Action Card */}
                            <GlassCard className="p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />

                                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                    {/* Price */}
                                    <div className="w-full flex justify-center pt-2">
                                        {course.pricingType === 'free' ? (
                                            <span className="text-4xl font-black text-text-primary drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">FREE</span>
                                        ) : (
                                            <span className="text-4xl font-black text-text-primary">{formatPrice(course.basePrice, course.currency)}</span>
                                        )}
                                    </div>

                                    {/* Primary CTA */}
                                    <Button size="lg" className="w-full h-14 text-[16px] font-black transition-all active:scale-[0.98]" onClick={handleCTA}>
                                        {isExpired ? 'RENEW ACCESS' : (isEnrolled ? 'ENTER PLAYER' : (course.pricingType === 'free' ? 'GET ACCESS' : 'Enroll Now'))}
                                    </Button>


                                    {/* Course includes */}
                                    <div className="w-full border-t border-white/5 pt-6 space-y-4">
                                        <h4 className="text-[14px] font-black text-text-primary text-center">This course includes:</h4>
                                        <div className="space-y-3">
                                            {stats.slice(0, 3).map((stat) => (
                                                <div key={stat.label} className="flex items-center justify-center gap-3 text-[14px] text-text-secondary">
                                                    <stat.icon size={16} className={`${stat.color} opacity-80`} />
                                                    <span>{stat.value} {stat.label} included</span>
                                                </div>
                                            ))}
                                            <div className="flex items-center justify-center gap-3 text-[14px] text-text-secondary">
                                                {course.validityDays ? (
                                                    <>
                                                        <Clock size={16} className="text-text-muted opacity-80" />
                                                        <span>{course.validityDays} days access</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Infinity size={16} className="text-text-muted opacity-80" />
                                                        <span>Full lifetime access</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>

            {isMobile && createPortal(
                <div className="mobile-sticky-bar" style={{
                    background: 'var(--bg-surface, #1a1a2e)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '12px 20px',
                    boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
                    boxSizing: 'border-box',
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                        {course.pricingType !== 'free' && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexShrink: 0 }}>
                                <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', fontFamily: 'Reddit Sans, sans-serif', lineHeight: 1 }}>{formatPrice(course.basePrice, course.currency)}</span>
                            </div>
                        )}
                        {course.pricingType === 'free' && (
                            <div style={{ flexShrink: 0 }}>
                                <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', fontFamily: 'Reddit Sans, sans-serif', lineHeight: 1 }}>FREE</span>
                            </div>
                        )}
                        <Button size="lg" className="font-black" style={{ flex: 1, height: '48px', fontSize: '15px', fontWeight: 800 }} onClick={handleCTA}>
                            {isExpired ? 'Renew Access' : (isEnrolled ? 'Enter Player' : (course.pricingType === 'free' ? 'Get Access' : 'Enroll Now'))}
                        </Button>
                    </div>
                </div>,
                document.body
            )}
            {/* PYQ Preview Modal */}
            <PYQPreviewModal 
                isOpen={isPyqModalOpen}
                onClose={() => { setIsPyqModalOpen(false); setActivePyq(null); }}
                activePyq={activePyq}
                isEnrolled={isEnrolled}
                onUnlock={() => { setIsPyqModalOpen(false); handleCTA(); }}
            />

        </>
    );
};

export default CourseDetailPage;
