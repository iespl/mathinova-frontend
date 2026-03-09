import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminClient.js';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', basePrice: '', branch: '' });

    const fetchData = async () => {
        try {
            const [coursesRes, branchesRes] = await Promise.all([
                adminApi.getCourses(),
                adminApi.getBranches()
            ]);
            setCourses(coursesRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createCourse({
                title: newCourse.title,
                basePrice: parseFloat(newCourse.basePrice) || 0,
                branch: newCourse.branch,
                description: 'New Course Draft',
                subjectType: 'General'
            });
            setShowCreate(false);
            setNewCourse({ title: '', basePrice: '', branch: '' });
            fetchData();
        } catch (error) {
            alert('Failed to create course');
        }
    };

    if (isLoading) return <div>Loading courses...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2rem' }}>Course Management</h1>
                <Button onClick={() => setShowCreate(true)}>+ New Course</Button>
            </div>

            {showCreate && (
                <GlassCard style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 2 }}>
                            <Input
                                label="Course Title"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Price (INR)"
                                type="number"
                                value={newCourse.basePrice}
                                onChange={(e) => setNewCourse({ ...newCourse, basePrice: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Branch</label>
                            <select
                                value={newCourse.branch}
                                onChange={(e) => setNewCourse({ ...newCourse, branch: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="" disabled className="bg-gray-800">Select Branch</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.name} className="bg-gray-800">{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit">Create</Button>
                        <Button type="button" variant="glass" onClick={() => setShowCreate(false)}>Cancel</Button>
                    </form>
                </GlassCard>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.map(course => (
                    <GlassCard key={course.id}>
                        <h3>{course.title}</h3>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            {course.category} • {course.subjectType || 'General'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>₹{course.basePrice}</div>
                            <span style={{
                                fontSize: '0.8rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: course.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: course.status === 'published' ? '#10B981' : 'var(--text-secondary)'
                            }}>
                                {course.status.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to={`/admin/courses/${course.id}`}>
                                <Button size="sm" variant="glass">Edit</Button>
                            </Link>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;
