import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import GlassCard from '../components/GlassCard.js';
import Button from '../components/Button.js';
import VideoPlayer from '../components/VideoPlayer.js';

const LearningPlayer: React.FC = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                // Use Secure Endpoint
                const { data } = await api.get(`/student/courses/${courseId}/content`);
                setCourse(data);
                // Default to first lesson of first module
                if (data.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(data.modules[0].lessons[0]);
                }
            } catch (err) {
                console.error('Failed to fetch course details', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleLessonComplete = async () => {
        if (!activeLesson) return;
        try {
            await api.patch(`/student/progress/${activeLesson.id}`, { status: 'completed' });
            // Update local state or trigger refresh
        } catch (err) {
            console.error('Failed to update progress', err);
        }
    };

    if (isLoading) return <div className="container" style={{ padding: '4rem' }}>Loading Classroom...</div>;
    if (!course) return <div className="container" style={{ padding: '4rem' }}>Course not found</div>;

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
            <div className="flex flex-col gap-6">
                <GlassCard style={{ padding: '0', height: '450px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeLesson ? (
                        activeLesson.videos?.[0]?.videoUrl ? (
                            <VideoPlayer src={activeLesson.videos[0].videoUrl} />
                        ) : (
                            <div className="text-center">
                                <h2 className="gradient-text" style={{ fontSize: '2rem' }}>No Video</h2>
                                <p className="text-text-secondary mt-2">Active: {activeLesson.title}</p>
                            </div>
                        )
                    ) : (
                        <span className="text-text-muted">Select a lesson to begin</span>
                    )}
                </GlassCard>

                <div className="flex flex-col gap-2">
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem' }}>{activeLesson?.title || course.title}</h2>
                    <p className="text-text-secondary">{activeLesson?.description || course.description}</p>
                    {activeLesson && (
                        <Button className="mt-4" style={{ alignSelf: 'flex-start' }} onClick={handleLessonComplete}>
                            Mark as Completed
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Course Content</h3>
                {course.modules?.map((mod: any) => (
                    <div key={mod.id} className="flex flex-col gap-2">
                        <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider">{mod.title}</h4>
                        {mod.lessons?.map((lsn: any) => (
                            <GlassCard
                                key={lsn.id}
                                className="p-4"
                                style={{
                                    borderColor: activeLesson?.id === lsn.id ? 'var(--primary-violet)' : 'var(--border-glass)',
                                    padding: '1rem'
                                }}
                                onClick={() => setActiveLesson(lsn)}
                            >
                                <span className="text-sm font-medium">{lsn.title}</span>
                            </GlassCard>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningPlayer;
