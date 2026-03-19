import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminClient.js';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import LessonEditor from './LessonEditor.js';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableModule from '../../components/Admin/SortableModule.js';
import SortableLesson from '../../components/Admin/SortableLesson.js';
import ConfirmModal from '../../components/Admin/ConfirmModal.js';
import CloneModal from '../../components/Admin/CloneModal.js';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import TrashIcon from '../../assets/trash.svg';

const CourseEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [isCreatingModule, setIsCreatingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [addingLessonToModule, setAddingLessonToModule] = useState<string | null>(null);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const [cloneConfig, setCloneConfig] = useState<{
        isOpen: boolean;
        type: 'module' | 'lesson';
        sourceId: string;
        sourceTitle: string;
    }>({
        isOpen: false,
        type: 'module',
        sourceId: '',
        sourceTitle: ''
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        basePrice: '',
        validityDays: '',
        subjectType: '',
        category: '',
        level: '',
        status: '',
        longDescription: '',
        thumbnail: '',
        promoVideoUrl: '',
        branch: '',
        learningPoints: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [{ data: courseData }, { data: branchData }] = await Promise.all([
                    adminApi.getCourseBasic(id),
                    adminApi.getBranches()
                ]);

                // Initial fetch for tree structure (optimized)
                const { data: treeData } = await adminApi.getCourse(id);
                setCourse(treeData);

                setBranches(branchData);

                setFormData({
                    title: courseData.title || '',
                    description: courseData.description || '',
                    basePrice: courseData.basePrice || '',
                    validityDays: courseData.validityDays || '',
                    subjectType: courseData.subjectType || '',
                    category: courseData.category || '',
                    level: courseData.level || '',
                    status: courseData.status || 'draft',
                    longDescription: courseData.longDescription || '',
                    thumbnail: courseData.thumbnail || '',
                    promoVideoUrl: courseData.promoVideoUrl || '',
                    branch: courseData.branch || '',
                    learningPoints: Array.isArray(courseData.learningPoints)
                        ? courseData.learningPoints.join('\n')
                        : ''
                });
            } catch (error) {
                console.error('Failed to fetch course data', error);
                alert('Failed to load course details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const refreshCourse = async (updatedLessonData?: { id: string, videos: any[], pyqs: any[] }) => {
        if (!id) return;
        const { data: newData } = await adminApi.getCourse(id);
        
        setCourse((prev: any) => {
            if (!prev || !prev.modules) return newData;
            
            // Merge to preserve lazy-loaded data
            const mergedModules = newData.modules.map((nm: any) => {
                const pm = prev.modules.find((m: any) => m.id === nm.id);
                if (!pm) return nm;
                
                return {
                    ...nm,
                    lessons: nm.lessons.map((nl: any) => {
                        // If this is the lesson we just updated, use the fresh details passed in
                        if (updatedLessonData && nl.id === updatedLessonData.id) {
                            return { ...nl, videos: updatedLessonData.videos, pyqs: updatedLessonData.pyqs };
                        }

                        const pl = pm.lessons.find((l: any) => l.id === nl.id);
                        if (!pl) return nl;
                        
                        // Preserve existing full data if present for other lessons
                        const hasVideos = pl.videos && pl.videos.length > 0;
                        const hasPyqs = pl.pyqs && pl.pyqs.length > 0;
                        
                        if (hasVideos || hasPyqs) {
                            return { ...nl, videos: pl.videos, pyqs: pl.pyqs };
                        }
                        return nl;
                    })
                };
            });
            
            return { ...newData, modules: mergedModules };
        });
        
        setAddingLessonToModule(null);
        setNewLessonTitle('');
    };

    const handleAddModule = async () => {
        if (!newModuleTitle) return;
        try {
            await adminApi.addModule(course.id, {
                title: newModuleTitle,
                order: (course.modules?.length || 0) + 1
            });
            setNewModuleTitle('');
            setIsCreatingModule(false);
            refreshCourse();
        } catch (error) {
            alert('Failed to add module');
        }
    };

    const handleCancelAddLesson = () => {
        setAddingLessonToModule(null);
        setNewLessonTitle('');
    };

    const handleCloneSuccess = (newId: string) => {
        refreshCourse();
        // Delay scroll to allow DOM to render
        setTimeout(() => {
            const element = document.getElementById(`lesson-${newId}`) || document.getElementById(`module-${newId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('ring-2', 'ring-purple-500', 'ring-offset-2', 'ring-offset-black');
                setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-purple-500', 'ring-offset-2', 'ring-offset-black');
                }, 3000);
            }
        }, 800);
    };

    const handleSaveLesson = async (moduleId: string, currentLessonCount: number) => {
        if (!newLessonTitle.trim()) return;
        try {
            await adminApi.addLesson(moduleId, {
                title: newLessonTitle.trim(),
                order: currentLessonCount + 1
            });
            refreshCourse();
        } catch (error) {
            alert('Failed to add lesson');
        }
    };

    const handleDeleteCourse = async () => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Entire Course?',
            message: 'ARE YOU ABSOLUTELY SURE? This will delete the entire course, all modules, lessons, videos, and quizzes. This operation CANNOT be reversed.',
            onConfirm: async () => {
                try {
                    await adminApi.deleteCourse(id!);
                    alert('Course deleted successfully');
                    navigate('/admin/courses');
                } catch (error) {
                    alert('Failed to delete course');
                }
            }
        });
    };

    const handleRenameModule = async (moduleId: string, newTitle: string) => {
        try {
            await adminApi.updateModule(moduleId, { title: newTitle });
            refreshCourse();
        } catch (error) {
            alert('Failed to rename module');
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Module?',
            message: 'Would you really like to delete this module and its lessons? This operation cannot be reversed.',
            onConfirm: async () => {
                try {
                    await adminApi.deleteModule(moduleId);
                    refreshCourse();
                } catch (error) {
                    alert('Failed to delete module');
                }
            }
        });
    };

    const handleDeleteLesson = async (lessonId: string) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Lesson?',
            message: 'Would you really like to delete this lesson and all its content? This operation cannot be reversed.',
            onConfirm: async () => {
                try {
                    await adminApi.deleteLesson(lessonId);
                    refreshCourse();
                } catch (error) {
                    alert('Failed to delete lesson');
                }
            }
        });
    };

    const findLessonByItemId = (itemId: string, itemType: 'video' | 'pyq' | 'lesson') => {
        if (!course.modules) return null;
        for (const m of course.modules) {
            for (const l of m.lessons) {
                if (itemType === 'lesson' && l.id === itemId) return { module: m, lesson: l };
                if (itemType === 'video' && l.videos?.some((v: any) => v.id === itemId)) return { module: m, lesson: l };
                if (itemType === 'pyq' && l.pyqs?.some((p: any) => p.id === itemId)) return { module: m, lesson: l };
            }
        }
        return null;
    };

    const handleLessonDataLoaded = (lessonId: string, data: any) => {
        setCourse((prev: any) => {
            if (!prev || !prev.modules) return prev;
            const newModules = prev.modules.map((m: any) => ({
                ...m,
                lessons: m.lessons.map((l: any) =>
                    l.id === lessonId ? { ...l, ...data } : l
                )
            }));
            return { ...prev, modules: newModules };
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeData = active.data.current;
        const overData = over.data.current;

        // 1. Handle Module Reordering
        if (activeData?.type === 'module') {
            if (activeId === overId) return;
            const oldIndex = course.modules.findIndex((m: any) => m.id === activeId);
            const newIndex = course.modules.findIndex((m: any) => m.id === overId);

            const newModules = arrayMove(course.modules, oldIndex, newIndex).map((m: any, idx) => ({
                ...m,
                order: idx + 1
            }));

            setCourse({ ...course, modules: newModules });
            try {
                await adminApi.reorderModules(newModules.map(m => ({ id: m.id, order: m.order })));
            } catch (error) {
                console.error('Failed to reorder modules', error);
                refreshCourse();
            }
            return;
        }

        // 2. Handle Lesson Reordering (within or across modules)
        if (activeData?.type === 'lesson') {
            if (activeId === overId) return;
            const activeInfo = findLessonByItemId(activeId, 'lesson');
            const overInfo = findLessonByItemId(overId, 'lesson') || (overData?.type === 'module' ? { module: course.modules.find((m: any) => m.id === overId), lesson: null } : null);

            if (!activeInfo || !overInfo) return;

            // Simple reorder within same module for now
            if (activeInfo.module.id !== overInfo.module.id) {
                return;
            }

            const moduleIdx = course.modules.findIndex((m: any) => m.id === activeInfo.module.id);
            const lessons = [...activeInfo.module.lessons];
            const oldIndex = lessons.findIndex(l => l.id === activeId);
            const newIndex = lessons.findIndex(l => l.id === overId);

            const newLessons = arrayMove(lessons, oldIndex, newIndex).map((l, idx) => ({
                ...l,
                order: idx + 1
            }));

            const newModules = [...course.modules];
            newModules[moduleIdx] = { ...activeInfo.module, lessons: newLessons };

            setCourse({ ...course, modules: newModules });
            try {
                await adminApi.reorderLessons(newLessons.map(l => ({ id: l.id, moduleId: activeInfo.module.id, order: l.order })));
            } catch (error) {
                console.error('Failed to reorder lessons', error);
                refreshCourse();
            }
            return;
        }

        // 3. Handle Video & PYQ Reordering (with cross-lesson support)
        if (activeData?.type === 'video' || activeData?.type === 'pyq') {
            const type = activeData.type as 'video' | 'pyq';
            const activeInfo = findLessonByItemId(activeId, type);
            const overInfo = findLessonByItemId(overId, type) || (overData?.type === 'lesson' ? findLessonByItemId(overId, 'lesson') : null);

            if (!activeInfo || !overInfo) return;

            const isSameLesson = activeInfo.lesson.id === overInfo.lesson.id;
            const newModules = [...course.modules];

            if (isSameLesson) {
                const moduleIdx = newModules.findIndex(m => m.id === activeInfo.module.id);
                const lessonIdx = newModules[moduleIdx].lessons.findIndex((l: any) => l.id === activeInfo.lesson.id);
                const items = type === 'video' ? [...newModules[moduleIdx].lessons[lessonIdx].videos] : [...newModules[moduleIdx].lessons[lessonIdx].pyqs];

                const oldIndex = items.findIndex(item => item.id === activeId);
                const newIndex = items.findIndex(item => item.id === overId);

                const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, order: idx }));

                if (type === 'video') newModules[moduleIdx].lessons[lessonIdx].videos = newItems;
                else newModules[moduleIdx].lessons[lessonIdx].pyqs = newItems;

                setCourse({ ...course, modules: newModules });
                try {
                    if (type === 'video') await adminApi.reorderVideos(newItems.map(v => ({ id: v.id, lessonId: activeInfo.lesson.id, order: v.order })));
                    else await adminApi.reorderPYQs(newItems.map(p => ({ id: p.id, lessonId: activeInfo.lesson.id, order: p.order })));
                } catch (error) {
                    console.error(`Failed to reorder ${type}s`, error);
                    refreshCourse();
                }
            } else {
                // Cross-lesson movement
                const sourceModuleIdx = newModules.findIndex(m => m.id === activeInfo.module.id);
                const sourceLessonIdx = newModules[sourceModuleIdx].lessons.findIndex((l: any) => l.id === activeInfo.lesson.id);
                const targetModuleIdx = newModules.findIndex(m => m.id === overInfo.module.id);
                const targetLessonIdx = newModules[targetModuleIdx].lessons.findIndex((l: any) => l.id === overInfo.lesson.id);

                const sourceItems = type === 'video' ? [...newModules[sourceModuleIdx].lessons[sourceLessonIdx].videos] : [...newModules[sourceModuleIdx].lessons[sourceLessonIdx].pyqs];
                const targetItems = type === 'video' ? [...newModules[targetModuleIdx].lessons[targetLessonIdx].videos] : [...newModules[targetModuleIdx].lessons[targetLessonIdx].pyqs];

                const activeItem = sourceItems.find(item => item.id === activeId);
                if (!activeItem) return;

                const updatedSourceItems = sourceItems.filter(item => item.id !== activeId).map((item, idx) => ({ ...item, order: idx }));
                const overItemIdx = targetItems.findIndex(item => item.id === overId);
                const insertionIdx = overItemIdx === -1 ? targetItems.length : overItemIdx;

                const updatedTargetItems = [...targetItems];
                updatedTargetItems.splice(insertionIdx, 0, { ...activeItem, lessonId: overInfo.lesson.id });
                const finalTargetItems = updatedTargetItems.map((item, idx) => ({ ...item, order: idx }));

                if (type === 'video') {
                    newModules[sourceModuleIdx].lessons[sourceLessonIdx].videos = updatedSourceItems;
                    newModules[targetModuleIdx].lessons[targetLessonIdx].videos = finalTargetItems;
                } else {
                    newModules[sourceModuleIdx].lessons[sourceLessonIdx].pyqs = updatedSourceItems;
                    newModules[targetModuleIdx].lessons[targetLessonIdx].pyqs = finalTargetItems;
                }

                setCourse({ ...course, modules: newModules });

                try {
                    if (type === 'video') {
                        await adminApi.reorderVideos([
                            ...updatedSourceItems.map(v => ({ id: v.id, lessonId: activeInfo.lesson.id, order: v.order })),
                            ...finalTargetItems.map(v => ({ id: v.id, lessonId: overInfo.lesson.id, order: v.order }))
                        ]);
                    } else {
                        await adminApi.reorderPYQs([
                            ...updatedSourceItems.map(p => ({ id: p.id, lessonId: activeInfo.lesson.id, order: p.order })),
                            ...finalTargetItems.map(p => ({ id: p.id, lessonId: overInfo.lesson.id, order: p.order }))
                        ]);
                    }
                } catch (error) {
                    console.error(`Failed to move ${type} across lessons`, error);
                    refreshCourse();
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const learningPointsArray = formData.learningPoints
                .split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0);
            await adminApi.updateCourse(id!, {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                validityDays: formData.validityDays ? parseInt(formData.validityDays) : null,
                learningPoints: learningPointsArray
            });
            alert('Course updated successfully');
            navigate('/admin/courses');
        } catch (error) {
            alert('Failed to update course');
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading course details...</div>;
    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div style={{ padding: '1rem 0' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold gradient-text">Edit Course: {course.courseCode}</h1>
                <div className="flex gap-4">
                    <Button variant="glass" onClick={() => navigate('/admin/courses')}>Back to List</Button>
                    <button
                        onClick={handleDeleteCourse}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-semibold flex items-center gap-2 cursor-pointer"
                    >
                        <img src={TrashIcon} alt="" style={{ width: '16px', height: '16px' }} className="opacity-70 group-hover:opacity-100 invert-[0.5] sepia-[1] saturate-[5] hue-rotate-[320deg]" />
                        Delete Course
                    </button>
                </div>
            </div>

            <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Course Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="" disabled>Select Branch</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description (Short)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                            placeholder="Brief Course Description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Long Description (HTML/Markdown supported)</label>
                        <textarea
                            name="longDescription"
                            value={formData.longDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-64"
                            placeholder="Detailed Course Description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">What You'll Learn <span className="text-gray-500 font-normal">(one point per line)</span></label>
                        <textarea
                            name="learningPoints"
                            value={formData.learningPoints}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-40 font-mono text-sm"
                            placeholder="Master core theoretical principles&#10;Solve previous year questions&#10;Build strong exam-ready foundations"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Thumbnail Image URL"
                            name="thumbnail"
                            value={formData.thumbnail}
                            onChange={handleChange}
                            placeholder="https://example.com/thumbnail.jpg"
                        />
                        <Input
                            label="Promo Video URL (YouTube)"
                            name="promoVideoUrl"
                            value={formData.promoVideoUrl}
                            onChange={handleChange}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Price (INR)"
                            name="basePrice"
                            type="number"
                            value={formData.basePrice}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Validity (Days)"
                            name="validityDays"
                            type="number"
                            placeholder="365"
                            value={formData.validityDays}
                            onChange={handleChange}
                        />
                        <Input
                            label="Subject Type"
                            name="subjectType"
                            value={formData.subjectType}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                        <Input
                            label="Level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="glass" onClick={() => navigate('/admin/courses')}>Cancel</Button>
                    </div>
                </form>
            </GlassCard>

            <div className="mt-8">
                <GlassCard>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Curriculum</h2>
                        <Button size="sm" onClick={() => setIsCreatingModule(true)}>+ Add Module</Button>
                    </div>

                    {isCreatingModule && (
                        <div className="mb-6 p-4 bg-white/5 rounded border border-white/10 flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    label="Module Title"
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    placeholder="Module Name"
                                />
                            </div>
                            <Button onClick={handleAddModule}>Add</Button>
                            <Button variant="glass" onClick={() => setIsCreatingModule(false)}>Cancel</Button>
                        </div>
                    )}

                    <div className="space-y-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={course.modules?.map((m: any) => m.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {course.modules?.map((m: any) => (
                                    <SortableModule
                                        key={m.id}
                                        module={m}
                                        onAddLesson={setAddingLessonToModule}
                                        onRename={handleRenameModule}
                                        onDelete={handleDeleteModule}
                                        onClone={(id, title) => setCloneConfig({ isOpen: true, type: 'module', sourceId: id, sourceTitle: title })}
                                    >
                                        {addingLessonToModule === m.id && (
                                            <div className="mb-4 p-3 bg-white/5 rounded border border-white/10 flex gap-3 items-end">
                                                <div className="flex-1">
                                                    <Input
                                                        label="Lesson Title"
                                                        value={newLessonTitle}
                                                        onChange={(e) => setNewLessonTitle(e.target.value)}
                                                        placeholder="Title of the new lesson"
                                                        autoFocus
                                                    />
                                                </div>
                                                <Button size="sm" onClick={() => handleSaveLesson(m.id, m.lessons?.length || 0)}>Add</Button>
                                                <Button size="sm" variant="glass" onClick={handleCancelAddLesson}>Cancel</Button>
                                            </div>
                                        )}

                                        <SortableContext
                                            items={m.lessons?.map((l: any) => l.id) || []}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-2">
                                                {m.lessons?.length === 0 && <p className="text-sm text-gray-500 italic">No lessons yet.</p>}
                                                {m.lessons?.map((l: any) => (
                                                    <SortableLesson
                                                        key={l.id}
                                                        lesson={l}
                                                        onEdit={setSelectedLesson}
                                                        onDelete={handleDeleteLesson}
                                                        onClone={(id, title) => setCloneConfig({ isOpen: true, type: 'lesson', sourceId: id, sourceTitle: title })}
                                                        onDataLoaded={handleLessonDataLoaded}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </SortableModule>
                                ))}
                            </SortableContext>
                        </DndContext>

                        {(!course.modules || course.modules.length === 0) && (
                            <div className="text-center py-8 text-gray-400">
                                No modules found. Start by adding one!
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {selectedLesson && (
                <LessonEditor
                    lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                    onUpdate={refreshCourse}
                />
            )}
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={confirmConfig.onConfirm}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />

            {/* Clone Modal */}
            <CloneModal
                isOpen={cloneConfig.isOpen}
                type={cloneConfig.type}
                sourceId={cloneConfig.sourceId}
                sourceTitle={cloneConfig.sourceTitle}
                currentCourseId={id!}
                onClose={() => setCloneConfig(prev => ({ ...prev, isOpen: false }))}
                onSuccess={handleCloneSuccess}
            />
        </div>
    );
};

export default CourseEditPage;
