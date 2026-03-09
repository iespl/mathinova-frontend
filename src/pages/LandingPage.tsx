import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    ArrowRight,
    CheckCircle,
    ChevronDown,
    Play,
    Shield,
    Smartphone,
    Users,
    Award,
    Clock,
    Zap,
    Star
} from 'lucide-react';
import Button from '../components/Button';
import CourseCard from '../components/CourseCard';
import heroIllustration from '../assets/hero-illustration.png';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';


// STREAMS is now dynamic and fetched from the API

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStream, setSelectedStream] = useState<string>('');
    const [courses, setCourses] = useState<any[]>([]); // State for courses
    const [branches, setBranches] = useState<any[]>([]); // State for branches
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingBranches, setLoadingBranches] = useState(true);

    const goToDiscovery = () => navigate('/discovery');

    // Dropdown state - No longer needed with standard select
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside - No longer needed
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //             setIsDropdownOpen(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, []);

    // const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleStreamSelect = (streamId: string) => {
        setSelectedStream(streamId);
        // setIsDropdownOpen(false); // No longer needed
    };

    // const selectedLabel = STREAMS.find(s => s.id === selectedStream)?.label || "Select your Branch (Show All)"; // No longer needed


    // Fetch courses and branches from Backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const coursesRes = await api.get('/courses');
                const uniqueCourses = Array.from(new Map(coursesRes.data.map((c: any) => [c.id, c])).values());
                console.log('Landing Page Fetched courses:', uniqueCourses);
                setCourses(uniqueCourses);
            } catch (error) {
                console.error('Error fetching courses for landing page:', error);
            } finally {
                setLoadingCourses(false);
            }

            try {
                // Fetch branches
                const branchesRes = await api.get('/courses/branches');
                setBranches(branchesRes.data);
            } catch (error) {
                console.error('Error fetching branches for landing page:', error);
            } finally {
                setLoadingBranches(false);
            }
        };
        fetchData();
    }, []);

    // Filter courses for the "Subject Packs" section based on selection
    // If no stream selected, show all (or a subset). If stream selected, filter by branch.
    const displayCourses = React.useMemo(() => {
        let filtered = [...courses];
        if (selectedStream) {
            filtered = courses.filter(course => course.branch === selectedStream);
        }

        // Sort by latest (createdAt desc) and limit to 4
        return filtered
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
    }, [selectedStream, courses]);

    // Derived state for guidance
    const streamLabel = branches.find(s => s.name === selectedStream)?.name;

    return (
        <div className="flex flex-col min-h-screen bg-bg-surface text-text-primary font-sans pt-10px">
            {/* SECTION 1: Hero */}
            <section className="relative pt-[100px] pb-5 md:pt-32 md:pb-5 px-4 overflow-hidden bg-hero-pattern">
                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Content */}
                        <div className="text-left">
                            {/* Announcement Chip */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-600 text-sm font-medium mb-4 cursor-pointer hover:bg-violet-200 transition-colors group w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                                </span>
                                Updated for VTU 2025–26
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-tight mb-4">
                                Get Exam-Ready for VTU Maths — Without Overstudying
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg md:text-xl text-text-secondary mb-6 max-w-xl">
                                Short videos, solved PYQs, and revision aligned exactly to VTU exams.
                            </p>

                            {/* Proof Points */}
                            <div className="flex flex-col gap-3 mb-10px">
                                {[
                                    "Solved previous year questions",
                                    "VTU syllabus aligned",
                                    "Free + paid subject packs"
                                ].map((point, index) => (
                                    <div key={index} className="flex items-center gap-2 text-text-secondary font-medium">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        {point}
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
                                <Button
                                    size="lg"
                                    onClick={goToDiscovery}
                                    className="w-full sm:w-auto px-10 py-4 text-lg shadow-lg hover:scale-105 transition-all cursor-pointer rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] border-none text-white font-bold"
                                >
                                    Explore Courses <ArrowRight className="ml-2 w-5 h-5 inline" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Illustration (Hidden on mobile and portrait tablet) */}
                        <div className="hidden lg:flex justify-center">
                            <div className="relative w-full max-w-[550px]">
                                <img
                                    src={heroIllustration}
                                    alt="Student studying VTU Maths"
                                    className="w-full h-auto drop-shadow-2xl animate-fade-in"
                                />
                                {/* Optional: Subtle glow behind illustration */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
            </section>


            {/* SECTION 2: Trust & Credibility Strip (Custom CSS) */}
            <section className="px-4 mt-32 relative z-20 bg-glow-subtle">
                <div className="container mx-auto relative">
                    <div className="credibility-strip">

                        {/* Item 1 */}
                        <div className="credibility-item group">
                            <Shield className="w-8 h-8 text-text-primary mb-1 credibility-icon" strokeWidth={1.5} />
                            <div className="flex flex-col gap-1">
                                <div className="font-bold text-base md:text-lg text-text-primary">VTU Syllabus Aligned</div>
                                <div className="text-sm text-text-secondary">Strictly per 2021/2022 scheme</div>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="credibility-item group">
                            <BookOpen className="w-8 h-8 text-text-primary mb-1 credibility-icon" strokeWidth={1.5} />
                            <div className="flex flex-col gap-1">
                                <div className="font-bold text-base md:text-lg text-text-primary">Concept + PYQ Based</div>
                                <div className="text-sm text-text-secondary">Learn concepts through problems</div>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="credibility-item group">
                            <Smartphone className="w-8 h-8 text-text-primary mb-1 credibility-icon" strokeWidth={1.5} />
                            <div className="flex flex-col gap-1">
                                <div className="font-bold text-base md:text-lg text-text-primary">Concise Videos</div>
                                <div className="text-sm text-text-secondary">No wasted time, exam focused</div>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="credibility-item group">
                            <Zap className="w-8 h-8 text-text-primary mb-1 credibility-icon" strokeWidth={1.5} />
                            <div className="flex flex-col gap-1">
                                <div className="font-bold text-base md:text-lg text-text-primary">Exam-Oriented</div>
                                <div className="text-sm text-text-secondary">Designed to boost your score</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Select Your Branch (Interactive) */}
            <section className="pt-20 pb-0 bg-bg-surface" style={{ position: 'relative', zIndex: 10 }}>
                <div className="container mx-auto px-4 text-center max-w-7xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
                        Find the Right Pack for Your Branch
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-10">
                        Select your engineering stream to see the prescribed maths subject packs.
                    </p>


                    {/* Standardized Stream Selector - Parity with Discovery Page */}
                    <div className="max-w-md mx-auto relative mb-24">
                        <select
                            className="w-full bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-text-primary text-lg font-bold shadow-lg focus:ring-4 focus:ring-violet-100/50 outline-none cursor-pointer appearance-none"
                            value={selectedStream}
                            onChange={(e) => handleStreamSelect(e.target.value)}
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value="">Select your Branch (Show All)</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.name}>{branch.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                            <ChevronDown className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Standardized Course Grid - Responsive horizontal row (exactly 4 on desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left w-full mt-5">
                        {loadingCourses ? (
                            <div className="col-span-full text-center py-10 text-text-muted animate-pulse">
                                Loading latest courses...
                            </div>
                        ) : displayCourses.length > 0 ? (
                            displayCourses.map((course) => (
                                <div key={course.id} className="h-full">
                                    <CourseCard
                                        course={course}
                                        onPreview={() => navigate(`/course/${course.slug}`)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-text-secondary text-lg">No courses found containing "{streamLabel}".</p>
                                <Button variant="ghost" onClick={() => setSelectedStream('')}>Clear Filter</Button>
                            </div>
                        )}
                    </div>

                    {/* View All */}
                    {displayCourses.length > 0 && (
                        <div className="mt-30px mb-30px">
                            <Button variant="outline" size="lg" onClick={goToDiscovery} className="rounded-full px-8 border-2 font-bold hover:bg-bg-surface-2">
                                View Full Catalog
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 4: Features / How it Works */}
            <section className="pt-20px pb-20 bg-bg-surface-2 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
                            Engineered for Your Success
                        </h2>
                        <p className="text-lg text-text-secondary">
                            We've stripped away the fluff. Here is how Mathinova helps you clear your exams with confidence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-bg-surface p-8 rounded-2xl border border-border-default shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6">
                                <Play className="w-7 h-7 fill-current" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3">Topic-wise Micro Videos</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Forget hour-long lectures. Our 10-15 minute videos cover specific topics precisely, making it easy to learn and revise.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-bg-surface p-8 rounded-2xl border border-border-default shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3">Solved PYQ Library</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Access a comprehensive library of solved Previous Year Questions, categorized by topic and difficulty.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-bg-surface p-8 rounded-2xl border border-border-default shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3">Exam-Day Strategy</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Learn exactly how to approach the paper, which questions to pick, and how to write answers to maximize marks.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* SECTION 6: Free Content */}
            <section className="pt-30px pb-20 bg-brand-primary/5 border-y border-brand-primary/10" id="free-content">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Not sure yet?</h2>
                    <p className="text-xl text-text-secondary mb-8">Start with free courses or watch real sample lessons.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="primary" onClick={goToDiscovery} className="px-8">
                            Browse Free Content
                        </Button>
                        <Button variant="glass" onClick={goToDiscovery}>
                            Watch Sample Lessons
                        </Button>
                    </div>
                </div>
            </section>

            {/* SECTION 7: Social Proof (Light) */}
            <section id="testimonials" className="py-20 px-4 bg-bg-surface-2 bg-glow-bottom">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold">Trusted by Engineering Students</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { quote: "Helped me revise faster before exams. The PYQ breakdown is a lifesaver.", author: "Rohan, 3rd Sem" },
                            { quote: "Finally understand Laplace transforms. Much better than random videos.", author: "Sneha, 4th Sem" },
                            { quote: "Structured and to the point. Exactly what I needed for internals.", author: "Aditya, 2nd Sem" },
                        ].map((t, i) => (
                            <div key={i} className="bg-bg-surface p-6 rounded-lg border border-border-default shadow-sm">
                                <div className="flex gap-1 text-yellow-500 mb-3">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-text-secondary mb-4 italic">"{t.quote}"</p>
                                <p className="font-bold text-sm text-text-primary">- {t.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* SECTION 8: Final CTA */}
            <section className="cta-section-v2">
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="cta-title">Start learning the right way.</h2>
                    <p className="cta-subtitle">Join thousands of students mastering Engineering Mathematics.</p>
                    <Button size="lg" onClick={goToDiscovery} className="px-10 py-5 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                        Explore Courses
                    </Button>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
