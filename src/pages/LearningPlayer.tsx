import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import GlassCard from '../components/GlassCard.js';
import VideoPlayer from '../components/VideoPlayer.js';
import QuizInterface from '../components/QuizInterface.js';
import PYQList from '../components/PYQList.js';
import { CheckCircle, Lock, PlayCircle, ClipboardList, HelpCircle, Check, ChevronRight, BookOpen, Play, FileText } from 'lucide-react';
import ExpiredAccessScreen from '../components/ExpiredAccessScreen.js';

const LearningPlayer: React.FC = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'video' | 'quiz' | 'pyq'>('video');
    const [isLoading, setIsLoading] = useState(true);
    const [isExpired, setIsExpired] = useState(false);
    const [expiryDate, setExpiryDate] = useState<string | null>(null);
    const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
    const lastUpdateRef = useRef<number>(0);
    const playerRef = useRef<HTMLDivElement>(null);

    const handleVideoPlay = () => {
        // Comprehensive scroll to top for maximum compatibility across browsers/containers
        const scrollOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
        window.scrollTo(scrollOptions);
        document.documentElement.scrollTo(scrollOptions);
        document.body.scrollTo(scrollOptions);
    };

    const fetchCourseDetails = async (isInitial = false) => {
        try {
            const { data } = await api.get(`/student/courses/${slug}/content`);
            setCourse(data);

            if (isInitial) {
                if (data.modules?.[0]?.lessons?.[0]) {
                    const firstLesson = data.modules[0].lessons[0];
                    setActiveLesson(firstLesson);
                    if (firstLesson.videos?.[0]) {
                        setActiveVideo(firstLesson.videos[0]);
                        setViewMode('video');
                    } else if (firstLesson.quiz) {
                        setViewMode('quiz');
                    }
                }
            } else if (activeLesson) {
                const updatedLesson = data.modules
                    ?.flatMap((m: any) => m.lessons)
                    ?.find((l: any) => l.id === activeLesson.id);
                if (updatedLesson) setActiveLesson(updatedLesson);
            }
        } catch (err: any) {
            console.error('Failed to fetch course details', err);

            // Check if it's an expiry error (403)
            if (err.response?.status === 403) {
                setIsExpired(true);
                setExpiryDate(err.response?.data?.expiryDate || null);
                setIsLoading(false);
                return;
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails(true);
    }, [slug]);

    // Auto-expand module when active lesson changes
    useEffect(() => {
        if (activeLesson && course?.modules) {
            const moduleContainingLesson = course.modules.find((m: any) =>
                m.lessons?.some((l: any) => l.id === activeLesson.id)
            );
            if (moduleContainingLesson && expandedModuleId !== moduleContainingLesson.id) {
                setExpandedModuleId(moduleContainingLesson.id);
            }
        }
    }, [activeLesson?.id, course?.modules]);

    // Auto-scroll everything to top when active lesson/video/mode changes
    useEffect(() => {
        if (activeLesson) {
            handleVideoPlay();
        }
    }, [activeLesson?.id, activeVideo?.id, viewMode]);

    // Auto-scroll sidebar to active content
    useEffect(() => {
        if (activeLesson) {
            // Use requestAnimationFrame to ensure the module expansion (state change above)
            // has rendered in the DOM before we try to find the element
            const scrollAction = () => {
                const elementId = activeVideo ? `video-${activeVideo.id}` : `lesson-${activeLesson.id}`;
                const element = document.getElementById(elementId);
                if (element) {
                    // Use block: 'nearest' for sidebar to avoid scrolling the main window
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            };

            // Wait for DOM updates
            requestAnimationFrame(() => {
                // Use a slightly longer delay to ensure player scroll (if any) starts first
                setTimeout(scrollAction, 150);
            });
        }
    }, [activeLesson?.id, activeVideo?.id, expandedModuleId]);

    const handleVideoProgress = React.useCallback(async (currentTime: number) => {
        if (!activeLesson || !activeVideo) return;

        const now = Date.now();
        if (now - lastUpdateRef.current > 10000 || currentTime > activeVideo.duration - 5) {
            lastUpdateRef.current = now;
            try {
                await api.post('/student/progress/video', {
                    lessonId: activeLesson.id,
                    videoId: activeVideo.id,
                    lastWatchedPosition: Math.floor(currentTime)
                });
                if (currentTime > activeVideo.duration - 2) {
                    fetchCourseDetails();
                }
            } catch (err) {
                console.error('Failed to update video progress', err);
            }
        }
    }, [activeLesson?.id, activeVideo?.id, fetchCourseDetails]);

    if (isExpired) {
        return <ExpiredAccessScreen
            courseTitle={course?.title || 'Course'}
            courseSlug={course?.slug || slug || ''}
            expiryDate={expiryDate || undefined}
        />;
    }

    if (isLoading) return <div className="p-20 text-center text-primary animate-pulse">Loading Mathinova Classroom...</div>;
    if (!course) return <div className="p-20 text-center text-red-400">Course not found.</div>;




    return (
        <div className="min-h-screen bg-bg-surface text-text-primary">
            <div className="container mx-auto px-4 pb-8 md:pb-12 max-w-[1400px]" style={{ paddingTop: '100px' }}>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Title, Player, Current Details (Dominant, ~66-75%) */}
                    <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                        {/* 1. Breadcrumbs & 2. Course Title */}
                        <div className="flex flex-col gap-2 mb-2">
                            <div className="text-[11px] text-text-secondary font-medium tracking-wide">
                                My Courses / {course?.title || 'Learning Details'}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-text-primary">
                                {course?.title || 'Learning Details'}
                            </h1>
                        </div>

                        {/* 3. Main Player Area */}

                        <div className="flex flex-col gap-4" ref={playerRef}>
                            {viewMode === 'video' && activeVideo ? (
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-black rounded-xl lg:rounded-2xl shadow-2xl">
                                    <VideoPlayer
                                        key={activeVideo.id}
                                        src={activeVideo.videoUrl}
                                        onTimeUpdate={handleVideoProgress}
                                        onPlay={handleVideoPlay}
                                    />
                                </div>
                            ) : viewMode === 'quiz' && activeLesson?.quiz ? (
                                <QuizInterface
                                    quiz={activeLesson.quiz}
                                    onComplete={() => fetchCourseDetails()}
                                />
                            ) : viewMode === 'pyq' && activeLesson?.pyqs ? (
                                <PYQList pyqs={activeLesson.pyqs} />
                            ) : (
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-bg-surface-2 bg-glow-subtle border border-border-default rounded-2xl">
                                    <div className="text-center p-12">
                                        <CheckCircle className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold text-text-primary text-glow">Ready to Learn?</h2>
                                        <p className="text-text-secondary mt-2">Select a module from the sidebar to begin.</p>
                                    </div>
                                </div>
                            )}

                            {/* 5. Currently playing content details (Below player) */}
                            <div className="px-1 py-2">
                                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">
                                    {viewMode === 'video' ? (activeVideo?.title || activeLesson?.title) :
                                        viewMode === 'quiz' ? 'Knowledge Assessment' : 'Practice & PYQs'}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar - Course Content (Accordion Redesign) */}
                    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-0 border border-black/10 rounded-xl overflow-hidden shadow-sm h-fit bg-white dark:bg-bg-obsidian">
                        {/* Sidebar Header */}
                        <div className="bg-white dark:bg-bg-obsidian p-5 border-b border-black/10">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-xl font-bold text-text-primary">Course Content</h3>
                                <span className="text-xxs font-bold text-text-secondary uppercase tracking-widest">{course.modules?.length} Modules</span>
                            </div>
                        </div>

                        {/* Accordion List */}
                        <div className="flex flex-col divide-y divide-black/10 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                            {course.modules?.map((mod: any, modIdx: number) => {
                                const isExpanded = expandedModuleId === mod.id || (!expandedModuleId && mod.lessons?.some((l: any) => l.id === activeLesson?.id));
                                const getOrdinal = (n: number) => {
                                    const s = ["th", "st", "nd", "rd"], v = n % 100;
                                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                                };

                                return (
                                    <div key={mod.id} className="flex flex-col">
                                        {/* Module Header (Accordion Trigger) */}
                                        <div
                                            onClick={() => setExpandedModuleId(isExpanded ? 'NONE' : mod.id)}
                                            className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-[#E5E7EB] dark:bg-bg-surface-2' : 'bg-[#D1D5DB] hover:bg-[#E5E7EB] dark:bg-bg-surface'}`}
                                        >
                                            <span className="text-sm font-bold text-text-primary">
                                                {mod.title}
                                            </span>
                                            <ChevronRight className={`w-4 h-4 text-text-primary transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>

                                        {/* Module Content (Expanded) */}
                                        {isExpanded && (
                                            <div className="flex flex-col bg-[#F9FAFB] dark:bg-bg-obsidian divide-y divide-black/5">
                                                {mod.lessons?.map((lsn: any) => {
                                                    const isLsnActive = activeLesson?.id === lsn.id;
                                                    const progress = lsn.progress?.[0];
                                                    const isCompleted = progress?.completed;

                                                    return (
                                                        <div key={lsn.id} className="flex flex-col border-b border-black/5 last:border-0 pl-1">
                                                            {/* Lesson Header (Structural Only) */}
                                                            <div id={`lesson-${lsn.id}`}
                                                                className={`px-8 py-3 transition-colors ${isLsnActive ? 'bg-white/50 dark:bg-bg-surface-2/20' : ''}`}
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isLsnActive ? 'text-primary' : 'text-text-primary/70'}`}>
                                                                        {lsn.title}
                                                                    </span>
                                                                </div>

                                                                {/* Lesson Sub-items List (Indented under Lesson) */}
                                                                <div className="ml-6 flex flex-col gap-3 mt-1">
                                                                    {/* 1. Video Lectures */}
                                                                    {lsn.videos?.map((vid: any) => {
                                                                        const isCurrentVid = activeVideo?.id === vid.id && viewMode === 'video' && isLsnActive;
                                                                        const isWatched = progress?.videoProgress?.[vid.id]?.watched;
                                                                        return (
                                                                            <div
                                                                                key={vid.id}
                                                                                id={`video-${vid.id}`}
                                                                                onClick={(e) => { e.stopPropagation(); setActiveVideo(vid); setViewMode('video'); setActiveLesson(lsn); }}
                                                                                className={`flex items-center justify-between py-3 group cursor-pointer ${isCurrentVid ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                                                            >
                                                                                <div className="flex items-center gap-2.5">
                                                                                    <div className={`w-1 h-1 rounded-full ${isCurrentVid ? 'bg-primary' : 'bg-text-muted opacity-40'}`} />
                                                                                    <span className="text-[11px] font-medium line-clamp-1">{vid.title}</span>
                                                                                </div>
                                                                                {isWatched && <Check className="w-3 h-3 text-green-500" />}
                                                                            </div>
                                                                        );
                                                                    })}

                                                                    {/* 2. PYQ Practice */}
                                                                    {lsn.pyqs?.length > 0 && (
                                                                        <div
                                                                            onClick={(e) => { e.stopPropagation(); setViewMode('pyq'); setActiveLesson(lsn); }}
                                                                            className={`flex items-center justify-between py-3 group cursor-pointer ${viewMode === 'pyq' && isLsnActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                                                        >
                                                                            <div className="flex items-center gap-2.5">
                                                                                <FileText className={`w-3.5 h-3.5 ${viewMode === 'pyq' && isLsnActive ? 'text-primary' : 'text-text-muted opacity-60'}`} />
                                                                                <span className="text-[11px] font-bold tracking-tight uppercase">PYQ Practice</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* 3. Lesson Quiz */}
                                                                    {lsn.quiz && (
                                                                        <div
                                                                            onClick={(e) => { e.stopPropagation(); setViewMode('quiz'); setActiveLesson(lsn); }}
                                                                            className={`flex items-center justify-between py-3 group cursor-pointer ${viewMode === 'quiz' && isLsnActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                                                        >
                                                                            <div className="flex items-center gap-2.5">
                                                                                <ClipboardList className={`w-3.5 h-3.5 ${viewMode === 'quiz' && isLsnActive ? 'text-primary' : 'text-text-muted opacity-60'}`} />
                                                                                <span className="text-[11px] font-bold tracking-tight uppercase">Lesson Quiz</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPlayer;
