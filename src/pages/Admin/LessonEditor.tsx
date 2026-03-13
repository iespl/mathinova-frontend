import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import RichTextEditor from '../../components/RichTextEditor.js';
import { adminApi } from '../../api/adminClient.js';
import DurationInput from '../../components/DurationInput.js';
import ConfirmModal from '../../components/Admin/ConfirmModal.js';
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
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableVideo from '../../components/Admin/SortableVideo.js';
import SortablePYQ from '../../components/Admin/SortablePYQ.js';
import SortableQuestion from '../../components/Admin/SortableQuestion.js';

import TrashIcon from '../../assets/trash.svg';

interface LessonEditorProps {
    lesson: any;
    onClose: () => void;
    onUpdate: () => void;
    initialTab?: 'videos' | 'pyqs' | 'quiz';
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onClose, onUpdate, initialTab = 'videos' }) => {
    const [videos, setVideos] = useState<any[]>(lesson.videos || []);
    const [pyqs, setPyqs] = useState<any[]>(lesson.pyqs || []);
    const [quiz, setQuiz] = useState<any>(lesson.quiz || null);
    const [editableTitle, setEditableTitle] = useState(lesson.title);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'videos' | 'pyqs' | 'quiz'>(initialTab);
    const [expandedPyq, setExpandedPyq] = useState<number | null>(null);
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

    const handleAddVideo = () => {
        setVideos([...videos, { title: '', videoUrl: '', duration: 0, isSample: false }]);
    };

    const handleVideoChange = (index: number, field: string, value: any) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: value };
        setVideos(newVideos);
    };

    const handleRemoveVideo = (index: number) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Remove Video?',
            message: 'Are you sure you want to remove this video from the lesson?',
            onConfirm: () => {
                setVideos(videos.filter((_, i) => i !== index));
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDragEndVideo = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = videos.findIndex((v: any) => (v.id || `video-${videos.indexOf(v)}`) === active.id);
        const newIndex = videos.findIndex((v: any) => (v.id || `video-${videos.indexOf(v)}`) === over.id);

        setVideos(arrayMove(videos, oldIndex, newIndex).map((v: any, idx: number) => ({ ...v, order: idx })));
    };

    // PYQ Handlers
    const handleAddPyq = () => {
        const newIndex = pyqs.length;
        setPyqs([...pyqs, {
            id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            questionText: '',
            answerText: '',
            solutionVideoUrl: '',
            order: newIndex,
            isSample: false,
            occurrences: [{ year: new Date().getFullYear(), month: 'June', courseCode: '', part: 'Part-A' }]
        }]);
        setExpandedPyq(newIndex);
    };

    const handlePyqChange = (index: number, field: string, value: any) => {
        const newPyqs = [...pyqs];
        newPyqs[index] = { ...newPyqs[index], [field]: value };
        setPyqs(newPyqs);
    };

    const handleAddOccurrence = (pyqIndex: number) => {
        const newPyqs = [...pyqs];
        const occurrences = newPyqs[pyqIndex].occurrences || [];
        newPyqs[pyqIndex].occurrences = [...occurrences, { year: new Date().getFullYear(), month: 'June', courseCode: '', part: 'Part-A' }];
        setPyqs(newPyqs);
    };

    const handleOccurrenceChange = (pyqIndex: number, occIndex: number, field: string, value: any) => {
        const newPyqs = [...pyqs];
        const occurrences = [...newPyqs[pyqIndex].occurrences];
        occurrences[occIndex] = { ...occurrences[occIndex], [field]: value };
        newPyqs[pyqIndex].occurrences = occurrences;
        setPyqs(newPyqs);
    };

    const handleRemoveOccurrence = (pyqIndex: number, occIndex: number) => {
        const newPyqs = [...pyqs];
        newPyqs[pyqIndex].occurrences = newPyqs[pyqIndex].occurrences.filter((_: any, i: number) => i !== occIndex);
        setPyqs(newPyqs);
    };

    const handleRemovePyq = (index: number) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Remove PYQ?',
            message: 'Are you sure you want to remove this PYQ from the lesson?',
            onConfirm: () => {
                setPyqs(pyqs.filter((_, i) => i !== index));
                if (expandedPyq === index) setExpandedPyq(null);
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDragEndPyq = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = pyqs.findIndex((p: any) => p.id === active.id);
        const newIndex = pyqs.findIndex((p: any) => p.id === over.id);

        setPyqs(arrayMove(pyqs, oldIndex, newIndex).map((p: any, idx: number) => ({ ...p, order: idx })));
    };

    const handleSmartSortPyqs = () => {
        const sorted = [...pyqs].sort((a, b) => {
            const getNumber = (text: string) => {
                const match = (text || '').match(/^Q?(\d+)/i);
                return match ? parseInt(match[1], 10) : Infinity;
            };
            const numA = getNumber(a.questionText);
            const numB = getNumber(b.questionText);
            if (numA === numB) return a.questionText?.localeCompare(b.questionText) || 0;
            return numA - numB;
        });
        setPyqs(sorted.map((p, idx) => ({ ...p, order: idx })));
    };

    const handleSaveSinglePyq = async (index: number): Promise<boolean> => {
        const pyq = pyqs[index];
        const isNew = pyq.id && pyq.id.startsWith('new-');
        try {
            if (pyq.id && !isNew) {
                await adminApi.updatePYQ(pyq.id, pyq);
            } else {
                // Do not send the temporary 'new-' ID to the backend
                const { id, ...pyqData } = pyq;
                const response = await adminApi.createPYQ(lesson.id, pyqData);
                const createdPyq = response.data;
                const newPyqs = [...pyqs];
                newPyqs[index] = createdPyq;
                setPyqs(newPyqs);
            }
            return true;
        } catch (error) {
            console.error('Error saving PYQ:', error);
            return false;
        }
    };

    // Quiz Handlers
    const handleToggleQuiz = () => {
        if (quiz) {
            setConfirmConfig({
                isOpen: true,
                title: 'Delete Quiz?',
                message: 'Would you really like to delete this quiz? All questions will be lost. This operation cannot be reversed.',
                onConfirm: () => {
                    setQuiz(null);
                    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                }
            });
        } else {
            setQuiz({ title: editableTitle + ' Quiz', description: '', isPublished: true, questions: [] });
        }
    };

    const handleQuizChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
    };

    const handleAddQuestion = () => {
        const newQuestions = [...(quiz.questions || []), {
            prompt: '',
            type: 'mcq_single',
            order: (quiz.questions || []).length,
            options: [
                { text: '', isCorrect: true },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ]
        }];
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleQuestionChange = (qIndex: number, field: string, value: any) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleRemoveQuestion = (qIndex: number) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Question?',
            message: 'Are you sure you want to remove this question from the quiz?',
            onConfirm: () => {
                const newQuestions = quiz.questions.filter((_: any, i: number) => i !== qIndex);
                setQuiz({ ...quiz, questions: newQuestions });
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDragEndQuestion = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = quiz.questions.findIndex((q: any) => (q.id || `question-${quiz.questions.indexOf(q)}`) === active.id);
        const newIndex = quiz.questions.findIndex((q: any) => (q.id || `question-${quiz.questions.indexOf(q)}`) === over.id);

        const newQuestions = arrayMove(quiz.questions, oldIndex, newIndex).map((q: any, idx) => ({ ...q, order: idx }));
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSave = async () => {
        if (!editableTitle.trim()) {
            alert('Lesson title cannot be empty');
            return;
        }

        setIsSaving(true);
        try {
            if (editableTitle.trim() !== lesson.title) {
                await adminApi.updateLesson(lesson.id, { title: editableTitle.trim() });
            }
            await adminApi.updateLessonContent(lesson.id, { videos, pyqs, quiz });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('Failed to save lesson');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md transition-all duration-300" style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
            {/* High-visibility Close Button aligned between logo and logout area (top right of modal space) */}
            <button
                onClick={onClose}
                className="fixed top-24 right-10 z-[70] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 border-2 border-white/30 text-white transition-all shadow-2xl hover:scale-110 active:scale-95 group"
                title="Close Editor"
            >
                <span className="text-xl font-bold group-hover:rotate-90 transition-transform">✕</span>
            </button>
            <GlassCard
                className="w-full max-w-6xl relative p-4 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl"
                style={{
                    maxHeight: 'calc(100vh - 120px)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'white',
                    color: 'black'
                }}
            >
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <input
                                value={editableTitle}
                                onChange={(e) => setEditableTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                    if (e.key === 'Escape') {
                                        setEditableTitle(lesson.title);
                                        (e.target as HTMLInputElement).blur();
                                    }
                                }}
                                className="text-xl font-bold text-black bg-transparent border-b border-transparent hover:border-black/30 focus:border-black focus:outline-none transition-all flex-1"
                                placeholder="Lesson Title"
                            />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={() => setActiveTab('videos')}
                                className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'videos' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                📹 Video Lectures ({videos.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('pyqs')}
                                className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'pyqs' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                📝 PYQs ({pyqs.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('quiz')}
                                className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'quiz' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                🧠 Quiz {quiz ? '(Active)' : '(None)'}
                            </button>
                        </div>
                    </div>
                    <Button variant="glass" size="sm" onClick={onClose}>✕</Button>
                </div>

                <div className="mt-4">
                    {/* Videos Section */}
                    {activeTab === 'videos' && (
                        <section className="space-y-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-blue-400">📹</span> Video Lectures
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {videos.length === 0 && <p className="text-gray-400 text-sm italic">No videos attached to this lesson.</p>}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEndVideo}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={videos.map((v, i) => v.id || `video-${i}`)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4">
                                            {videos.map((video, index) => (
                                                <SortableVideo
                                                    key={video.id || `video-${index}`}
                                                    video={video}
                                                    index={index}
                                                    onChange={handleVideoChange}
                                                    onRemove={handleRemoveVideo}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                                <div className="mt-4 flex justify-start">
                                    <Button size="sm" variant="glass" onClick={handleAddVideo}>+ Add Video</Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* PYQs Section */}
                    {activeTab === 'pyqs' && (
                        <section className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-yellow-400">📝</span> Previous Year Questions
                                </h3>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="glass" onClick={handleSmartSortPyqs} title="Sort automatically by Q-ID">✨ Smart Sort</Button>
                                    <Button size="sm" variant="glass" onClick={handleAddPyq}>+ Add PYQ</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {pyqs.length === 0 && <p className="text-gray-400 text-sm italic">No PYQs attached to this lesson.</p>}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEndPyq}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={pyqs.map((p) => p.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4">
                                            {pyqs.map((pyq, index) => (
                                                <SortablePYQ
                                                    key={pyq.id}
                                                    pyq={pyq}
                                                    index={index}
                                                    isExpanded={expandedPyq === index}
                                                    onToggle={() => setExpandedPyq(expandedPyq === index ? null : index)}
                                                    onChange={handlePyqChange}
                                                    onRemove={handleRemovePyq}
                                                    onSave={handleSaveSinglePyq}
                                                    onAddOccurrence={handleAddOccurrence}
                                                    onOccurrenceChange={handleOccurrenceChange}
                                                    onRemoveOccurrence={handleRemoveOccurrence}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                                <div className="mt-4 flex justify-start">
                                    <Button size="sm" variant="glass" onClick={handleAddPyq}>+ Add PYQ</Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Quiz Section */}
                    {activeTab === 'quiz' && (
                        <section className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-purple-400">🧠</span> Lesson Quiz
                                </h3>
                                <button
                                    onClick={handleToggleQuiz}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${quiz ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-blue-500/30 text-blue-400 hover:bg-blue-400/10'}`}
                                >
                                    {quiz ? 'Delete Quiz' : '+ Create Quiz'}
                                </button>
                            </div>

                            {quiz ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Quiz Title</label>
                                            <Input
                                                value={quiz.title}
                                                onChange={(e) => handleQuizChange('title', e.target.value)}
                                                placeholder="Mid-term Assessment..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Description</label>
                                            <Input
                                                value={quiz.description}
                                                onChange={(e) => handleQuizChange('description', e.target.value)}
                                                placeholder="Test your knowledge of..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Questions ({quiz.questions?.length || 0})</h4>
                                            <Button size="sm" variant="glass" onClick={handleAddQuestion}>+ Add Question</Button>
                                        </div>

                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEndQuestion}
                                            modifiers={[restrictToVerticalAxis]}
                                        >
                                            <SortableContext
                                                items={(quiz.questions || []).map((q: any, i: number) => q.id || `question-${i}`)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-4">
                                                    {(quiz.questions || []).map((q: any, qIdx: number) => (
                                                        <SortableQuestion
                                                            key={q.id || `question-${qIdx}`}
                                                            question={q}
                                                            index={qIdx}
                                                            onChange={handleQuestionChange}
                                                            onRemove={handleRemoveQuestion}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-500">
                                    <p className="text-sm">No Quiz attached to this lesson.</p>
                                    <button
                                        onClick={handleToggleQuiz}
                                        className="text-xs text-blue-400 mt-2 hover:underline"
                                    >Create one now</button>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-4">
                    <Button variant="glass" onClick={onClose}>Cancel</Button>
                    <Button isLoading={isSaving} onClick={handleSave}>Save Changes</Button>
                </div>
            </GlassCard>
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={confirmConfig.onConfirm}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default LessonEditor;
