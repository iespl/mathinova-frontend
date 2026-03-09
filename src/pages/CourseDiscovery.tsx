import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    basePrice: number;
    currency: string;
    pricingType?: 'paid' | 'free';
    thumbnail?: string;
    slug: string;
    branch?: string;
    level?: string;
}

import { ChevronDown, Search } from 'lucide-react';

// STREAMS is now dynamic and fetched from the API

const CourseDiscovery: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [branches, setBranches] = useState<any[]>([]); // State for branches
    const [loading, setLoading] = useState(true);
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/courses');
                const uniqueCourses = Array.from(new Map(response.data.map((c: any) => [c.id, c])).values()) as Course[];
                setCourses(uniqueCourses);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Error loading courses');
            } finally {
                setLoading(false);
            }

            try {
                const branchesRes = await api.get('/courses/branches');
                setBranches(branchesRes.data);
            } catch (error) {
                console.error('Error fetching branches for discovery page:', error);
            } finally {
                setLoadingBranches(false);
            }
        };

        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStream = true;
        if (selectedStream) {
            // New Logic: Filter by 'branch' field from backend
            if (course.branch) {
                matchesStream = course.branch === selectedStream;
            } else {
                matchesStream = false;
            }
        }

        return matchesSearch && matchesStream;
    });

    return (
        <div className="min-h-screen bg-bg-surface selection:bg-primary-violet selection:text-white pb-20">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 md:pt-40 max-w-[1400px]">
                <div className="text-left mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
                        Find the Right Pack for Your Branch
                    </h2>
                    <p className="text-text-secondary max-w-2xl mb-10">
                        Select your engineering stream to see the prescribed maths subject packs.
                    </p>

                    <div className="discovery-filter-container">
                        {/* Stream Selector - Left Aligned */}
                        <div className="discovery-filter-item-select">
                            <select
                                className="w-full bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-text-primary text-lg font-bold shadow-lg focus:ring-4 focus:ring-violet-100/50 outline-none cursor-pointer appearance-none"
                                value={selectedStream}
                                onChange={(e) => setSelectedStream(e.target.value)}
                                style={{ backgroundImage: 'none', width: '100%' }}
                            >
                                <option value="">Select your Branch (Show All)</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.name}>{branch.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Input - Right Aligned, fills remaining space */}
                        <div className="discovery-filter-item-search group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-violet transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-14 pr-6 py-4 text-text-primary text-lg font-medium shadow-lg focus:ring-4 focus:ring-violet-100/20 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Discovery Grid...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>
                        <h3>Error Loading Courses</h3>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 text-left w-full mt-[20px]">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="h-full">
                                <CourseCard
                                    course={course}
                                    onPreview={() => {
                                        navigate(`/course/${course.slug}`);
                                    }}
                                />
                            </div>
                        ))}
                        {filteredCourses.length === 0 && (
                            <div className="col-span-full text-center py-24 text-text-muted">
                                <p className="text-lg mb-4">No courses found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedStream(''); }}
                                    className="text-primary-violet font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDiscovery;
