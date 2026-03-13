import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import GlassCard from '../components/GlassCard.js';
import Button from '../components/Button.js';
import { ArrowRight, Layers } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                console.log('Starting native fetch...');
                const token = localStorage.getItem('mathinova_token');

                const response = await fetch('http://127.0.0.1:4000/api/student/courses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response Status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Data received:', data);
                setCourses(data);
            } catch (err) {
                console.error('Failed to fetch enrolled courses', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div className="animate-pulse">
                    <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Loading Your Mastery... (127.0.0.1)</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh' }}>
            <div className="hero-glow" style={{ opacity: 0.6 }} />

            <div className="container mx-auto px-4 max-w-[1400px]" style={{ padding: '4rem 0' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 className="gradient-text animate-fade-in" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                        Your Learning
                    </h1>
                    <p className="text-text-secondary animate-fade-in" style={{ fontSize: '1.125rem' }}>
                        Track your progress and continue your journey to engineering excellence.
                    </p>
                </header>

                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {courses.length === 0 ? (
                        <GlassCard style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                            <div style={{ marginBottom: '2rem', opacity: 0.5 }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No active enrollments found</h3>
                            <p className="text-text-secondary mb-6" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                                Expand your knowledge base by exploring our premium engineering courses.
                            </p>
                            <Link to="/discovery">
                                <Button size="lg">Explore Catalog</Button>
                            </Link>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {courses.map((enrollment: any) => {
                                const isExpired = enrollment.isExpired || enrollment.status === 'expired';
                                const expiresAt = enrollment.expiresAt ? new Date(enrollment.expiresAt) : null;
                                const linkTo = isExpired
                                    ? `/course/${enrollment.course.slug || enrollment.courseId}`
                                    : `/learn/${enrollment.course.slug || enrollment.courseId}`;

                                return (
                                    <Link
                                        to={linkTo}
                                        key={enrollment.id}
                                        className="block group"
                                    >
                                        <GlassCard
                                            className="course-card h-full flex flex-col hover:scale-[1.02] transition-all duration-300 hover:border-primary/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.2)]"
                                            style={{ padding: '0.75rem' }}
                                        >
                                            <div className="w-full h-[140px] bg-[#111] overflow-hidden relative rounded-lg mb-4">
                                                {enrollment.course.thumbnail ? (
                                                    <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-violet-900/40 opacity-50" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                {isExpired && (
                                                    <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        Expired
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                                        {enrollment.course.level || 'Professional'}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                    {enrollment.course.title}
                                                </h3>

                                                {/* Expiry Date Display - Only for Paid Courses */}
                                                {!isExpired && expiresAt && enrollment.course.pricingType === 'paid' && (
                                                    <div className="mb-3 text-xs text-text-muted">
                                                        <span className="opacity-60">Valid until:</span>{' '}
                                                        <span className="text-primary font-semibold">
                                                            {expiresAt.toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-text-muted text-xs font-bold uppercase tracking-tight">
                                                        <span className="text-primary/60">Modules: {enrollment.course._count.modules}</span>
                                                    </div>
                                                    <div className={`${isExpired ? 'text-red-400' : 'text-primary'} group-hover:translate-x-1 transition-transform flex items-center gap-2 font-bold text-xs uppercase tracking-widest`}>
                                                        <span>{isExpired ? 'Renew Access' : 'Resume'}</span>
                                                        <ArrowRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
